'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    SURVEY_SECTIONS, FREE_SUFFIX, ROLE_OPTIONS, MINISTRY_OPTIONS, CAREER_OPTIONS,
    CHRIST_QUESTIONS, CATEGORY_LABEL, TESTFLIGHT_URL, ANDROID_APK_URL,
    SurveyQuestion,
} from '../_content';

// ───────────── 팔레트 (advisory 와 통일) ─────────────
const NAVY = '#0f172a';
const BLUE = '#4f6ef2';
const BG = '#fbfbfd';
const BORDER = '#e2e8f0';

// ───────────── localStorage 키 ─────────────
const LS_UID = 'soluma_survey_uid_v1';
const LS_DATA = 'soluma_survey_data_v1';

// 응답 데이터 형태
interface Basic {
    name: string; church: string; role: string; roleEtc: string;
    phone: string; email: string; ministry: string[]; career: string;
}
type Answers = Record<string, string | string[]>; // 84문항: 라디오=string, 복수=string[], 자유의견=string
type ChristMemos = Record<string, string>;         // 크라이스트 30문항 메모

interface SurveyData {
    basic: Basic;
    answers: Answers;
    christMemos: ChristMemos;
}

const emptyData = (): SurveyData => ({
    basic: { name: '', church: '', role: '', roleEtc: '', phone: '', email: '', ministry: [], career: '' },
    answers: {},
    christMemos: {},
});

// 서버 응답(row) → 폼 데이터
function mapServer(srv: any): SurveyData {
    return {
        basic: {
            name: srv.name || '', church: srv.church || '',
            role: ROLE_OPTIONS.includes(srv.role) ? srv.role : (srv.role ? '기타' : ''),
            roleEtc: srv.role && !ROLE_OPTIONS.includes(srv.role) ? srv.role : '',
            phone: srv.phone || '', email: srv.email || '',
            ministry: Array.isArray(srv.ministry) ? srv.ministry : [],
            career: srv.career || '',
        },
        answers: srv.answers && typeof srv.answers === 'object' ? srv.answers : {},
        christMemos: srv.christ_memos && typeof srv.christ_memos === 'object' ? srv.christ_memos : {},
    };
}

// 휴대폰 번호 → 숫자만 (010-1234 / 01012 34 동일 처리)
const phoneDigits = (s: string) => (s || '').replace(/\D/g, '');

// 기기 감지
function detectOS(): 'ios' | 'android' | 'other' {
    if (typeof navigator === 'undefined') return 'other';
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'other';
}

// ═══════════════════════════════════════════════════════════
export default function SurveyForm() {
    const [loaded, setLoaded] = useState(false);
    const uidRef = useRef<string>('');
    const [data, setData] = useState<SurveyData>(emptyData());
    const [savedAt, setSavedAt] = useState<number>(0);   // 마지막 저장 시각 (표시용)
    const [saving, setSaving] = useState(false);
    const saveTimer = useRef<any>(null);
    const os = useMemo(detectOS, []);

    // ── 본인 확인(이름 + 휴대폰) — 폰/PC 어디서나 이어쓰기 ──
    const [identified, setIdentified] = useState(false);
    const [gateName, setGateName] = useState('');
    const [gatePhone, setGatePhone] = useState('');
    const [gateBusy, setGateBusy] = useState(false);
    const [gateErr, setGateErr] = useState('');

    // ── 최초 진입: 같은 기기면 자동 복원, 아니면 본인 확인(게이트) 노출 ──
    useEffect(() => {
        let uid = '';
        try { uid = localStorage.getItem(LS_UID) || ''; } catch { /* noop */ }
        if (uid && uid.startsWith('p:')) {
            uidRef.current = uid;
            // localStorage 우선 복원
            let local: SurveyData | null = null;
            try {
                const raw = localStorage.getItem(LS_DATA);
                if (raw) local = { ...emptyData(), ...JSON.parse(raw) };
            } catch { /* noop */ }
            if (local) setData(local);
            setIdentified(true);
            setLoaded(true);
            // 서버 동기화 (localStorage 가 비어있을 때만 서버값으로 채움)
            fetch(`/api/survey?uid=${encodeURIComponent(uid)}`)
                .then((r) => r.json())
                .then((d) => { const srv = d?.response; if (!srv || local) return; setData(mapServer(srv)); })
                .catch(() => { /* noop */ });
        } else {
            setLoaded(true); // 본인 확인 화면 표시
        }
    }, []);

    // ── 직분 최종값(기타면 직접입력) ──
    const resolvedRole = useCallback((b: Basic) => (b.role === '기타' ? (b.roleEtc || '기타') : b.role), []);

    // ── 서버 저장 페이로드 ──
    const buildPayload = useCallback((d: SurveyData) => ({
        respondent_uid: uidRef.current,
        name: d.basic.name || null,
        church: d.basic.church || null,
        role: resolvedRole(d.basic) || null,
        phone: d.basic.phone || null,
        email: d.basic.email || null,
        ministry: d.basic.ministry,
        career: d.basic.career || null,
        answers: d.answers,
        christ_memos: d.christMemos,
    }), [resolvedRole]);

    // ── 변경 즉시 localStorage 저장 + 1.5초 디바운스 서버 upsert ──
    const persist = useCallback((next: SurveyData) => {
        try { localStorage.setItem(LS_DATA, JSON.stringify(next)); } catch { /* noop */ }
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaving(true);
        saveTimer.current = setTimeout(() => {
            fetch('/api/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload(next)),
            })
                .then(() => { setSavedAt(Date.now()); })
                .catch(() => { /* 오프라인이어도 localStorage 에 남음 */ })
                .finally(() => setSaving(false));
        }, 1500);
    }, [buildPayload]);

    const update = useCallback((fn: (d: SurveyData) => SurveyData) => {
        setData((prev) => {
            const next = fn(prev);
            persist(next);
            return next;
        });
    }, [persist]);

    // ── 본인 확인 입장(이름+휴대폰) → 기존 응답 있으면 이어쓰기, 없으면 새로 시작 ──
    const enterIdentity = useCallback(async () => {
        const nm = gateName.trim();
        const digits = phoneDigits(gatePhone);
        if (!nm) { setGateErr('성함을 입력해 주세요.'); return; }
        if (digits.length < 9) { setGateErr('휴대폰 번호를 정확히 입력해 주세요. (숫자 9자리 이상)'); return; }
        setGateErr('');
        const uid = 'p:' + digits;
        uidRef.current = uid;
        try { localStorage.setItem(LS_UID, uid); } catch { /* noop */ }
        setGateBusy(true);
        try {
            const r = await fetch(`/api/survey?uid=${encodeURIComponent(uid)}`);
            const d = await r.json();
            const srv = d?.response;
            if (srv) {
                // 같은 번호로 저장된 응답 → 이어쓰기
                const restored = mapServer(srv);
                setData(restored);
                try { localStorage.setItem(LS_DATA, JSON.stringify(restored)); } catch { /* noop */ }
            } else {
                // 처음 — 이름/휴대폰 미리 채워 새로 시작 + 서버에 행 생성
                const fresh: SurveyData = { ...emptyData(), basic: { ...emptyData().basic, name: nm, phone: gatePhone.trim() } };
                setData(fresh);
                try { localStorage.setItem(LS_DATA, JSON.stringify(fresh)); } catch { /* noop */ }
                fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(fresh)) }).catch(() => {});
            }
        } catch {
            // 오프라인이어도 이름/휴대폰으로 시작 (localStorage 에 보관)
            const fresh: SurveyData = { ...emptyData(), basic: { ...emptyData().basic, name: nm, phone: gatePhone.trim() } };
            setData(fresh);
            try { localStorage.setItem(LS_DATA, JSON.stringify(fresh)); } catch { /* noop */ }
        } finally {
            setGateBusy(false);
            setIdentified(true);
        }
    }, [gateName, gatePhone, buildPayload]);

    // 다른 사람으로 시작 (공용 기기 대비) — 이 기기 캐시만 비움, 서버 응답은 그대로 보존
    const resetIdentity = useCallback(() => {
        try { localStorage.removeItem(LS_UID); localStorage.removeItem(LS_DATA); } catch { /* noop */ }
        uidRef.current = '';
        setData(emptyData());
        setGateName(''); setGatePhone(''); setGateErr('');
        setIdentified(false);
    }, []);

    // ── 핸들러 ──
    const setBasic = useCallback((patch: Partial<Basic>) => {
        update((d) => ({ ...d, basic: { ...d.basic, ...patch } }));
    }, [update]);

    const setAnswer = useCallback((key: string, value: string | string[]) => {
        update((d) => ({ ...d, answers: { ...d.answers, [key]: value } }));
    }, [update]);

    const setMemo = useCallback((id: number, value: string) => {
        update((d) => ({ ...d, christMemos: { ...d.christMemos, [String(id)]: value } }));
    }, [update]);

    // ── 진행률 (기본정보 핵심 + 84문항 객관식/서술 + 30메모) ──
    const progress = useMemo(() => {
        let total = 0, done = 0;
        // 기본정보: 성함/교회/직분 3개 핵심
        total += 3;
        if (data.basic.name.trim()) done++;
        if (data.basic.church.trim()) done++;
        if (resolvedRole(data.basic).trim()) done++;
        // 84문항 (메인 답 기준 — 자유의견 제외)
        SURVEY_SECTIONS.forEach((s) => s.questions.forEach((q) => {
            total++;
            const v = data.answers[q.id];
            if (Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim())) done++;
        }));
        // 크라이스트 30 메모
        CHRIST_QUESTIONS.forEach((q) => {
            total++;
            if ((data.christMemos[String(q.id)] || '').trim()) done++;
        });
        return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    }, [data, resolvedRole]);

    if (!loaded) {
        return <div style={{ minHeight: '100dvh', background: BG }} />;
    }

    // 본인 확인 전 — 이름 + 휴대폰 입력 화면
    if (!identified) {
        return (
            <IdentityGate
                name={gateName} setName={setGateName}
                phone={gatePhone} setPhone={setGatePhone}
                busy={gateBusy} err={gateErr} onSubmit={enterIdentity}
            />
        );
    }

    // 저장 표시 텍스트
    const savedLabel = saving ? '저장 중…' : savedAt ? '자동 저장됨 ✓' : '입력 시 자동 저장';

    return (
        <div style={{ minHeight: '100dvh', background: BG, color: NAVY }}>
            {/* ── 상단 고정 진행바 ── */}
            <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', borderBottom: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ height: 5, background: '#eef0f6' }}>
                    <div style={{ height: '100%', width: `${progress.pct}%`, background: BLUE, transition: 'width 0.3s' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', maxWidth: 720, margin: '0 auto' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {data.basic.name ? `${data.basic.name}님` : '목회자 자문 설문'}
                        </span>
                        <button onClick={resetIdentity}
                            style={{ flexShrink: 0, fontSize: 11.5, color: '#94a3b8', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                            다른 분
                        </button>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{progress.pct}% · {progress.done}/{progress.total}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: saving ? '#94a3b8' : '#16a34a' }}>{savedLabel}</span>
                    </span>
                </div>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 80px' }}>
                {/* ── 1. 앱 설치 안내 ── */}
                <InstallCard os={os} />

                {/* ── 인사말 ── */}
                <Card>
                    <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.35 }}>SOLUMA 프리런칭 목회자 자문 설문</h1>
                    <p style={{ fontSize: 16, lineHeight: 1.8, color: '#334155', margin: 0 }}>
                        본 설문은 ROOT와 SOLUMA의 비전, 주요 기능, 그리고 향후 설립될 기독교 비영리재단에 대한 목회자님의 고견을 듣기 위한 자문 설문입니다.
                        목사님의 소중한 의견은 솔루마의 개발 방향과 한국교회를 섬기는 사역의 기준으로 적극 반영될 예정입니다. 감사합니다.
                    </p>
                    <p style={{ fontSize: 14.5, color: '#64748b', marginTop: 14, lineHeight: 1.7 }}>
                        모든 입력은 <strong style={{ color: BLUE }}>자동으로 저장</strong>됩니다. 저장 버튼은 따로 없습니다.
                        중간에 폰을 끄셔도, <strong style={{ color: BLUE }}>처음 입력하신 휴대폰 번호</strong>로 다시 들어오시면
                        폰이든 PC든 어디서나 작성하시던 내용이 그대로 이어집니다.
                    </p>
                </Card>

                {/* ── 2. 기본 정보 (Ⅰ. 1~7) ── */}
                <SectionHeader emoji="📋" idLabel="Ⅰ" title="기본 정보" />
                <Card>
                    <TextField label="1. 성함" value={data.basic.name} onChange={(v) => setBasic({ name: v })} placeholder="예: 홍길동 목사" />
                    <TextField label="2. 교회명" value={data.basic.church} onChange={(v) => setBasic({ church: v })} placeholder="소속 교회" />

                    {/* 3. 직분 */}
                    <FieldLabel>3. 직분</FieldLabel>
                    <OptionGrid
                        options={ROLE_OPTIONS}
                        selected={data.basic.role ? [data.basic.role] : []}
                        multi={false}
                        onToggle={(opt) => setBasic({ role: data.basic.role === opt ? '' : opt })}
                    />
                    {data.basic.role === '기타' && (
                        <input
                            value={data.basic.roleEtc}
                            onChange={(e) => setBasic({ roleEtc: e.target.value })}
                            placeholder="직분 직접 입력"
                            style={inputStyle({ marginTop: 8 })}
                        />
                    )}

                    <div style={{ height: 14 }} />
                    <TextField label="4. 연락처" value={data.basic.phone} onChange={(v) => setBasic({ phone: v })} placeholder="전화번호" type="tel" />
                    <TextField label="5. 이메일" value={data.basic.email} onChange={(v) => setBasic({ email: v })} placeholder="이메일" type="email" />

                    {/* 6. 담당 사역 분야 (복수) */}
                    <FieldLabel>6. 담당 사역 분야 <span style={{ fontWeight: 700, color: '#94a3b8' }}>(복수 선택)</span></FieldLabel>
                    <OptionGrid
                        options={MINISTRY_OPTIONS}
                        selected={data.basic.ministry}
                        multi
                        onToggle={(opt) => {
                            const on = data.basic.ministry.includes(opt);
                            setBasic({ ministry: on ? data.basic.ministry.filter((x) => x !== opt) : [...data.basic.ministry, opt] });
                        }}
                    />

                    {/* 7. 목회 경력 */}
                    <FieldLabel>7. 목회 경력</FieldLabel>
                    <OptionGrid
                        options={CAREER_OPTIONS}
                        selected={data.basic.career ? [data.basic.career] : []}
                        multi={false}
                        onToggle={(opt) => setBasic({ career: data.basic.career === opt ? '' : opt })}
                    />
                </Card>

                {/* ── 3. 84문항 본설문 (Ⅱ~Ⅸ) ── */}
                {SURVEY_SECTIONS.map((section) => (
                    <div key={section.id}>
                        <SectionHeader emoji="📝" idLabel={section.title.split('.')[0]} title={section.title.replace(/^[^.]+\.\s*/, '')} />
                        {section.questions.map((q) => (
                            <QuestionCard
                                key={q.id}
                                q={q}
                                answer={data.answers[q.id]}
                                free={(data.answers[q.id + FREE_SUFFIX] as string) || ''}
                                onAnswer={(v) => setAnswer(q.id, v)}
                                onFree={(v) => setAnswer(q.id + FREE_SUFFIX, v)}
                            />
                        ))}
                    </div>
                ))}

                {/* ── 4. 크라이스트 테스트 30문항 검증 ── */}
                <SectionHeader emoji="✝️" idLabel="크라이스트" title="크라이스트 테스트 30문항 — 문항·답변 검증" />
                <Card>
                    <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '13px 15px', marginBottom: 14 }}>
                        <p style={{ fontSize: 15.5, fontWeight: 800, color: '#92400e', margin: 0, lineHeight: 1.65 }}>
                            ⚠️ 여기는 문제를 푸는 곳이 아닙니다.<br />
                            각 문항의 <strong>질문과 답변(선택지)이 적절한지 검토</strong>해 주세요.
                        </p>
                    </div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.8, color: '#334155', margin: 0 }}>
                        아래 30개 문항은 30~40대 장년을 위한 크라이스트 테스트 문항입니다.
                        각 문항의 <strong>질문</strong>과 <strong>답변 선택지</strong>를 보시고,
                        <strong style={{ color: BLUE }}> 정답을 고르는 것이 아니라, 문항과 답변 자체가 자연스럽고 적절한지</strong> 검토 의견을 적어 주세요.
                        (채점 점수는 검증에 영향을 주지 않도록 숨겨져 있습니다.)
                    </p>
                </Card>
                {CHRIST_QUESTIONS.map((q, i) => {
                    const prevCat = i > 0 ? CHRIST_QUESTIONS[i - 1].category : null;
                    const showCat = q.category !== prevCat;
                    return (
                        <div key={q.id}>
                            {showCat && (
                                <div style={{ margin: '20px 2px 8px', fontSize: 13, fontWeight: 800, color: BLUE, letterSpacing: 0.4 }}>
                                    {CATEGORY_LABEL[q.category] || q.category}
                                </div>
                            )}
                            <ChristCard
                                q={q}
                                memo={data.christMemos[String(q.id)] || ''}
                                onMemo={(v) => setMemo(q.id, v)}
                            />
                        </div>
                    );
                })}

                {/* ── 마무리 ── */}
                <div style={{ textAlign: 'center', marginTop: 30, padding: '24px 16px', background: 'linear-gradient(160deg,#0b1220,#1e293b)', borderRadius: 20, color: '#fff' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🙏</div>
                    <p style={{ fontSize: 16.5, fontWeight: 800, lineHeight: 1.6, margin: 0 }}>
                        목사님의 귀한 조언이 솔루마의 방향을 세우는 중요한 기준이 됩니다.<br />진심으로 감사드립니다.
                    </p>
                    <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 16, fontWeight: 700 }}>
                        모든 응답은 자동 저장되었습니다 · {savedLabel}
                    </p>
                    <p style={{ marginTop: 18, fontSize: 13, color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>ROOT &amp; SOLUMA</p>
                    <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>모든 것은 뿌리되신 하나님으로부터</p>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 본인 확인 화면 (이름 + 휴대폰) — 폰/PC 어디서나 이어쓰기
function IdentityGate({ name, setName, phone, setPhone, busy, err, onSubmit }: {
    name: string; setName: (v: string) => void;
    phone: string; setPhone: (v: string) => void;
    busy: boolean; err: string; onSubmit: () => void;
}) {
    return (
        <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#0b1220,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', width: '100%', maxWidth: 400, boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/app-icon.png" alt="soluma" width={60} height={60} style={{ borderRadius: 14, marginBottom: 14 }} />
                    <h1 style={{ fontSize: 21, fontWeight: 900, color: NAVY, margin: 0 }}>목회자 자문 설문</h1>
                    <p style={{ fontSize: 14, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>
                        성함과 휴대폰 번호를 입력해 주세요.<br />
                        <strong style={{ color: BLUE }}>같은 번호</strong>로 다시 들어오시면 폰·PC 어디서나 작성하던 내용이 이어집니다.
                    </p>
                </div>
                <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="성함 (예: 홍길동 목사)"
                    style={{ width: '100%', height: 52, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16.5, marginBottom: 10, boxSizing: 'border-box' }}
                />
                <input
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대폰 번호 (예: 010-1234-5678)"
                    type="tel" inputMode="tel"
                    onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }}
                    style={{ width: '100%', height: 52, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16.5, marginBottom: 10, boxSizing: 'border-box' }}
                />
                {err && <p style={{ color: '#dc2626', fontSize: 13.5, margin: '2px 0 10px' }}>{err}</p>}
                <button onClick={onSubmit} disabled={busy}
                    style={{ width: '100%', height: 54, borderRadius: 14, border: 'none', background: NAVY, color: '#fff', fontSize: 16.5, fontWeight: 800, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                    {busy ? '확인 중…' : '시작 / 이어쓰기 →'}
                </button>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12, textAlign: 'center', lineHeight: 1.6 }}>
                    번호는 본인 확인과 이어쓰기에만 사용됩니다.
                </p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 앱 설치 안내 카드
function InstallCard({ os }: { os: 'ios' | 'android' | 'other' }) {
    const dimIos = os === 'android';
    const dimAndroid = os === 'ios';
    return (
        <div style={{ marginTop: 18, padding: '22px 20px', background: 'linear-gradient(160deg,#eef2ff,#f5f7ff)', border: `1.5px solid #dbe3ff`, borderRadius: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: BLUE, letterSpacing: 0.5, marginBottom: 8 }}>STEP 1 · 앱 먼저 설치</div>
            <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.4, color: NAVY }}>
                먼저 솔루마 앱을 설치하고 직접 둘러보신 뒤<br />설문을 작성해 주세요
            </h2>
            <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, margin: '0 0 16px' }}>
                사용하시는 휴대폰에 맞는 버튼을 눌러 설치해 주세요. 앱을 직접 경험하신 후의 의견이 가장 소중합니다.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a
                    href={TESTFLIGHT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={installBtnStyle(!dimIos)}
                >
                    <span style={{ fontSize: 22 }}></span>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.25 }}>
                        <span style={{ fontSize: 16.5, fontWeight: 900 }}>iPhone — TestFlight로 설치</span>
                        <span style={{ fontSize: 12.5, opacity: 0.85, fontWeight: 600 }}>아이폰 사용자{!dimIos && os === 'ios' ? ' · 추천' : ''}</span>
                    </span>
                </a>
                <a
                    href={ANDROID_APK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={installBtnStyle(!dimAndroid, true)}
                >
                    <span style={{ fontSize: 22 }}>🤖</span>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.25 }}>
                        <span style={{ fontSize: 16.5, fontWeight: 900 }}>Android — APK 설치</span>
                        <span style={{ fontSize: 12.5, opacity: 0.85, fontWeight: 600 }}>안드로이드 사용자{!dimAndroid && os === 'android' ? ' · 추천' : ''}</span>
                    </span>
                </a>
            </div>
            {os !== 'ios' && (
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6, margin: '12px 2px 0' }}>
                    💡 안드로이드는 다운로드한 파일을 열어 설치합니다. 처음이면 “출처를 알 수 없는 앱 설치 허용”을 한 번 켜 주세요. (정식 출시 후에는 Play 스토어에서 받으실 수 있습니다.)
                </p>
            )}
        </div>
    );
}

function installBtnStyle(highlight: boolean, android = false): React.CSSProperties {
    return {
        display: 'flex', alignItems: 'center', gap: 14,
        textDecoration: 'none',
        padding: '15px 18px',
        borderRadius: 15,
        background: highlight ? (android ? '#1f2937' : '#000') : '#fff',
        color: highlight ? '#fff' : '#94a3b8',
        border: highlight ? 'none' : `1.5px solid ${BORDER}`,
        opacity: highlight ? 1 : 0.6,
        boxShadow: highlight ? '0 6px 18px rgba(15,23,42,0.18)' : 'none',
        minHeight: 58,
    };
}

// ═══════════════════════════════════════════════════════════
// 공통 UI 조각
function Card({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ marginTop: 14, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '20px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
            {children}
        </div>
    );
}

function SectionHeader({ emoji, idLabel, title }: { emoji: string; idLabel: string; title: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '34px 2px 4px' }}>
            <span style={{ fontSize: 22 }}>{emoji}</span>
            <div>
                <div style={{ fontSize: 12.5, fontWeight: 900, color: BLUE, letterSpacing: 0.5 }}>{idLabel}</div>
                <div style={{ fontSize: 18.5, fontWeight: 900, color: NAVY, lineHeight: 1.3 }}>{title}</div>
            </div>
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label style={{ display: 'block', fontSize: 15.5, fontWeight: 800, color: '#334155', margin: '4px 0 9px' }}>{children}</label>;
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
    return {
        width: '100%', minHeight: 50, height: 50, borderRadius: 12, border: `1.5px solid ${BORDER}`,
        padding: '0 14px', fontSize: 16.5, boxSizing: 'border-box', outline: 'none', color: NAVY,
        background: '#fff', ...extra,
    };
}

function TextField({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <div style={{ marginBottom: 14 }}>
            <FieldLabel>{label}</FieldLabel>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle()} />
        </div>
    );
}

// 선택지 버튼 그리드 (라디오/체크박스 공통)
function OptionGrid({ options, selected, multi, onToggle }: {
    options: string[]; selected: string[]; multi: boolean; onToggle: (opt: string) => void;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {options.map((opt) => {
                const on = selected.includes(opt);
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onToggle(opt)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%',
                            border: `2px solid ${on ? BLUE : '#e7e9f2'}`, background: on ? '#eef2ff' : '#fff',
                            borderRadius: 14, padding: '13px 15px', fontSize: 16.5, fontWeight: on ? 800 : 600,
                            color: on ? BLUE : '#334155', cursor: 'pointer', minHeight: 52,
                        }}
                    >
                        <span style={{
                            width: 24, height: 24, flexShrink: 0, borderRadius: multi ? 7 : 999,
                            border: `2px solid ${on ? BLUE : '#cbd5e1'}`, background: on ? BLUE : '#fff',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                        }}>{on ? '✓' : ''}</span>
                        <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                );
            })}
        </div>
    );
}

// 자유의견 입력칸
function FreeText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%', minHeight: 84, marginTop: 12, border: `1.5px solid ${BORDER}`, borderRadius: 13,
                padding: '12px 14px', fontSize: 16, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit', lineHeight: 1.7, color: NAVY, background: '#fff',
            }}
        />
    );
}

// 본설문 문항 카드
function QuestionCard({ q, answer, free, onAnswer, onFree }: {
    q: SurveyQuestion;
    answer: string | string[] | undefined;
    free: string;
    onAnswer: (v: string | string[]) => void;
    onFree: (v: string) => void;
}) {
    const selected: string[] = Array.isArray(answer) ? answer : answer ? [String(answer)] : [];

    return (
        <Card>
            {q.label && <div style={{ fontSize: 13, fontWeight: 800, color: BLUE, marginBottom: 6 }}>{q.label}</div>}
            <p style={{ fontSize: 17.5, fontWeight: 800, color: NAVY, lineHeight: 1.55, margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>
                <span style={{ color: BLUE, marginRight: 6 }}>{q.no}.</span>{q.question}
            </p>

            {q.kind === 'text' && (
                <FreeText value={free || (typeof answer === 'string' ? answer : '')} onChange={(v) => { onAnswer(v); }} placeholder="자유롭게 작성해 주세요." />
            )}

            {(q.kind === 'radio' || q.kind === 'checkbox') && (
                <>
                    {q.kind === 'checkbox' && <p style={{ fontSize: 13.5, color: '#94a3b8', margin: '-4px 0 10px' }}>복수 선택 가능</p>}
                    <OptionGrid
                        options={q.options || []}
                        selected={selected}
                        multi={q.kind === 'checkbox'}
                        onToggle={(opt) => {
                            if (q.kind === 'radio') {
                                onAnswer(selected[0] === opt ? '' : opt);
                            } else {
                                const on = selected.includes(opt);
                                onAnswer(on ? selected.filter((x) => x !== opt) : [...selected, opt]);
                            }
                        }}
                    />
                    {q.freeText && (
                        <>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b', margin: '14px 0 0' }}>자유의견</div>
                            <FreeText value={free} onChange={onFree} placeholder="자유의견을 적어 주세요. (선택)" />
                        </>
                    )}
                </>
            )}
        </Card>
    );
}

// 크라이스트 30문항 검증 카드
function ChristCard({ q, memo, onMemo }: {
    q: typeof CHRIST_QUESTIONS[number]; memo: string; onMemo: (v: string) => void;
}) {
    return (
        <Card>
            <p style={{ fontSize: 17.5, fontWeight: 800, color: NAVY, lineHeight: 1.55, margin: '0 0 12px' }}>
                <span style={{ color: BLUE, marginRight: 6 }}>Q{q.id}.</span>{q.question}
            </p>

            <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', marginBottom: 8, letterSpacing: 0.3 }}>답변 선택지 — 검토 대상 (고르는 칸이 아닙니다)</div>
            {/* 답변 선택지 (읽기 전용, 점수 숨김) */}
            {q.type === 'SCENARIO' && q.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {q.options.map((opt, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: 10, alignItems: 'flex-start',
                            background: '#f8fafc', border: `1px solid ${BORDER}`, borderRadius: 11,
                            padding: '11px 13px', fontSize: 15.5, color: '#475569', lineHeight: 1.55,
                        }}>
                            <span style={{ flexShrink: 0, fontWeight: 800, color: '#94a3b8' }}>{['①', '②', '③', '④'][i] || i + 1}</span>
                            <span>{opt}</span>
                        </div>
                    ))}
                </div>
            )}
            {q.type === 'AGREE_DISAGREE' && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#f8fafc', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '13px 15px',
                }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#475569' }}>← {q.leftLabel}</span>
                    <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700 }}>4점 척도</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#475569' }}>{q.rightLabel} →</span>
                </div>
            )}

            {/* 검증 메모 */}
            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b', margin: '14px 0 0' }}>
                이 문항의 질문과 답변에 대한 의견이 있다면 적어 주세요
            </div>
            <FreeText value={memo} onChange={onMemo} placeholder="문항·답변에 대한 의견 (수정 제안, 어색한 표현, 신학적 우려 등)" />
        </Card>
    );
}
