import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';
import { SURVEY_SECTIONS, FREE_SUFFIX, CHRIST_QUESTIONS } from '../../../survey/_content';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ALL_Q = SURVEY_SECTIONS.flatMap((s) => s.questions);

function asText(v: unknown): string {
    if (v == null) return '';
    return Array.isArray(v) ? v.join(', ') : String(v);
}

// 목회자 자문 설문의 서술형/자유의견/크라이스트 메모를 AI로 요약
// Authorization: Bearer <supabase-access-token>
export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const sb = getAdminSupabase();
        const { data, error } = await sb
            .from('survey_responses')
            .select('name,church,role,answers,christ_memos');
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        const rows = data || [];
        if (rows.length === 0) {
            return NextResponse.json({ summary: '아직 응답이 없습니다.', count: 0 });
        }

        // 서술형 + 자유의견 + 크라이스트 메모를 텍스트 코퍼스로 모음
        const lines: string[] = [];
        for (const r of rows as any[]) {
            const who = `${r.name || '익명'}${r.church ? `(${r.church})` : ''}`;
            for (const q of ALL_Q) {
                if (q.kind === 'text') {
                    const a = asText(r.answers?.[q.id]);
                    if (a.trim()) lines.push(`[Q${q.no} ${q.question.split('\n')[0]}] ${who}: ${a}`);
                }
                const free = asText(r.answers?.[q.id + FREE_SUFFIX]);
                if (free.trim()) lines.push(`[Q${q.no} 자유의견] ${who}: ${free}`);
            }
            for (const cq of CHRIST_QUESTIONS) {
                const m = asText(r.christ_memos?.[String(cq.id)]);
                if (m.trim()) lines.push(`[크라이스트 Q${cq.id}] ${who}: ${m}`);
            }
        }

        if (lines.length === 0) {
            return NextResponse.json({ summary: '서술형 의견이 아직 없습니다.', count: rows.length });
        }

        // 토큰 가드 (대략 24k자)
        const corpus = lines.join('\n').slice(0, 24000);

        const systemPrompt = `당신은 설문 분석 전문가입니다. 목회자 자문 설문의 서술형 응답을 분석해 경영진(대표)이 30초 안에 핵심을 파악하도록 한국어로 요약하세요.

[출력 구조 — 이 마크다운 제목을 그대로 사용]
## 한 줄 총평
## 주요 긍정 의견
(불릿 3~5개)
## 공통 우려·리스크
(불릿 3~5개, 빈도가 높은 순)
## 구체적 제안·요청
(불릿 3~5개)
## 인상적인 코멘트
(2~3개, "인용" — 작성자 형식)

[규칙]
- 응답에 없는 내용은 절대 지어내지 말 것
- 여러 명이 비슷하게 말한 주제는 묶어서 (예: "3명이 작은 교회 배려를 언급")
- 간결하고 실행 가능하게`;

        const userPrompt = `목회자 ${rows.length}명의 자문 설문 서술형 응답입니다. 위 구조로 분석·요약해 주세요.\n\n${corpus}`;

        const { data: aiData, error: aiErr } = await sb.functions.invoke('openai-proxy', {
            body: {
                action: 'chat',
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.4,
                max_tokens: 1600,
            },
        });
        if (aiErr) return NextResponse.json({ error: aiErr.message || 'AI 호출 오류' }, { status: 500 });
        if (aiData?.error) {
            const msg = typeof aiData.error === 'string' ? aiData.error : (aiData.error?.message || 'AI 오류');
            return NextResponse.json({ error: msg }, { status: 500 });
        }
        const summary = aiData?.choices?.[0]?.message?.content;
        if (typeof summary !== 'string') {
            return NextResponse.json({ error: 'AI 응답 형식 오류' }, { status: 500 });
        }

        return NextResponse.json({ summary, count: rows.length, opinions: lines.length });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
