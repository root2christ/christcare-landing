import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '말씀 노트 — soluma 사용 설명서',
    description: '주일 설교와 은혜받은 말씀을 정리하는 말씀 노트. 사용법과 무료 안내.',
};

const S: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f7f5f0', padding: '40px 20px 80px' },
    wrap: { maxWidth: 760, margin: '0 auto' },
    back: { color: '#0f766e', fontWeight: 800, textDecoration: 'none', fontSize: 14 },
    h1: { fontSize: 32, fontWeight: 900, color: '#1e293b', margin: '14px 0 6px' },
    lead: { color: '#475569', fontSize: 16.5, lineHeight: 1.75, margin: '0 0 22px' },
    h2: { fontSize: 21, fontWeight: 900, color: '#0f766e', margin: '38px 0 12px', paddingLeft: 12, borderLeft: '5px solid #2f9e6f' },
    p: { color: '#334155', fontSize: 15.5, lineHeight: 1.8, margin: '0 0 10px' },
    card: { background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, padding: '18px 20px', margin: '0 0 12px', boxShadow: '0 2px 8px rgba(15,23,42,.04)' },
    ul: { margin: '6px 0 0', paddingLeft: 20, color: '#334155', fontSize: 15, lineHeight: 1.9 },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14.5, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #eef2f7' },
    th: { textAlign: 'left' as const, padding: '11px 14px', background: '#faf9f6', color: '#94a3b8', fontWeight: 800, fontSize: 12.5, borderBottom: '1px solid #eef2f7' },
    td: { padding: '11px 14px', borderBottom: '1px solid #f1f5f9', color: '#334155', verticalAlign: 'top' as const },
    badgeFree: { background: '#e3f4ec', color: '#0f766e', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    badgePremium: { background: '#fdf0d8', color: '#a8730a', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    badgeOwn: { background: '#eef2ff', color: '#4f46e5', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    step: { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' as const, margin: '0 0 30px' },
    stepText: { flex: '1 1 300px', minWidth: 280 },
    stepNum: { display: 'inline-flex', width: 30, height: 30, borderRadius: 15, background: '#2f9e6f', color: '#fff', fontWeight: 900, alignItems: 'center', justifyContent: 'center', marginRight: 9, fontSize: 15 },
    stepTitle: { fontSize: 17.5, fontWeight: 900, color: '#1e293b', margin: '0 0 8px', display: 'flex', alignItems: 'center' },
    shot: { width: 250, maxWidth: '100%', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 8px 22px rgba(15,23,42,.12)' },
    dot: { display: 'inline-block', width: 12, height: 12, borderRadius: 6, marginRight: 7 },
    tip: { background: '#fdf9f0', border: '1.5px solid #f2d8a8', borderRadius: 14, padding: '14px 18px', color: '#7c5a10', fontSize: 14.5, lineHeight: 1.8 },
};

export default function NoteTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>📝 말씀 노트</h1>
                <p style={S.lead}>
                    <b>주일 설교와 은혜받은 말씀을 기록하는 노트</b>입니다.
                    들을 때는 분명 은혜였는데 일주일이 지나면 흐릿해지곤 하죠 —
                    핵심 메시지와 마음에 남은 문장을 적어두면 그 말씀이 한 주의 삶으로 이어집니다.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>정해진 틀</b>이 있어요 — 날짜·설교 제목·본문 말씀·핵심 메시지·은혜받은 문장·적용까지, 항목을 따라 채우기만 하면 설교 정리가 끝나요.</li>
                        <li>본문 말씀은 <b>성경에서 직접 선택</b>해 정확하게 남길 수 있어요.</li>
                        <li><b>적용(결단/실천)</b> 칸이 있어서 들은 말씀을 한 주의 실천으로 연결해줘요.</li>
                        <li>정리한 설교를 바탕으로 <b>AI 맞춤 미션</b>을 받아볼 수 있어요.</li>
                        <li>기록이 쌓이면 나만의 <b>설교 아카이브</b>가 돼요 — 언제든 다시 꺼내 볼 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>말씀 노트 작성 · 열람 · 보관</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 말씀 노트 기록은 무료로 사용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/note/list.png" alt="말씀 노트 목록 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>말씀 노트 열고 새 노트 만들기</p>
                        <p style={S.p}>
                            홈 화면 <b>my</b> 위젯이나 <b>말씀 탭</b>에서 말씀 노트에 들어가세요.
                            처음이라면 &ldquo;이번 주일 설교를 정리하고 AI 맞춤 미션을 받아보세요&rdquo;라는
                            안내와 함께 <b>[+ 첫 노트 작성하기]</b> 버튼이 보여요.
                            오른쪽 위 <b>파란 + 버튼</b>으로도 언제든 새 노트를 만들 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/note/editor.png" alt="말씀 노트 작성 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>항목을 따라 채우고 저장</p>
                        <ul style={S.ul}>
                            <li><span style={{ ...S.dot, background: '#10b981' }} /><b>날짜 · 설교 제목 · 설교자(선택)</b> — 어떤 설교였는지 기본 정보를 적어요.</li>
                            <li><span style={{ ...S.dot, background: '#3b82f6' }} /><b>본문 말씀</b> — [본문을 선택하세요]를 눌러 설교 본문 구절을 선택해요.</li>
                            <li><span style={{ ...S.dot, background: '#f59e0b' }} /><b>핵심 메시지</b> — 설교의 핵심을 한두 문장으로 요약해요.</li>
                            <li><span style={{ ...S.dot, background: '#e13232' }} /><b>은혜받은 문장 · 적용(결단/실천)</b> — 마음에 와닿은 문장과 이번 한 주 어떻게 살아갈지를 적어요.</li>
                        </ul>
                        <p style={{ ...S.p, marginTop: 8 }}>
                            다 적었으면 오른쪽 위 <b>저장 아이콘</b>을 누르면 완료됩니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 예배 <b>직후</b>에 쓰는 게 가장 좋아요 — 은혜받은 문장은 시간이 지나면 금방 흐려집니다.<br />
                    💡 다 못 채워도 괜찮아요 — <b>핵심 메시지 한 줄</b>만 남겨도 다음 주에 다시 꺼내 볼 수 있어요.<br />
                    💡 <b>적용(결단/실천)</b> 칸을 꼭 채워보세요 — 설교가 &lsquo;들은 말씀&rsquo;에서 &lsquo;사는 말씀&rsquo;으로 바뀝니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
