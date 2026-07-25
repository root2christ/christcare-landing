import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '간증 — soluma 사용 설명서',
    description: '하나님이 하신 일을 나누는 간증 피드. 은혜·응답·회복의 이야기를 올리고 서로 격려해요.',
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

export default function TestimonyTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🙌 간증</h1>
                <p style={S.lead}>
                    <b>하나님이 하신 일을 나누는 간증 피드</b>입니다.
                    일상에서 경험한 은혜, 기도 응답, 회복의 이야기를 올리면
                    다른 성도들이 반응과 댓글로 함께 기뻐하고 격려해줘요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>은혜·응답·회복의 이야기</b>를 글로 남기며 하나님이 하신 일을 기억하게 돼요.</li>
                        <li>다른 성도들의 간증을 읽는 것만으로도 <b>믿음에 큰 격려</b>가 됩니다.</li>
                        <li><b>좋아요와 댓글</b>로 서로의 간증에 반응하며 함께 은혜를 나눠요.</li>
                        <li>드러내기 조심스러운 이야기는 <b>익명으로도</b> 올릴 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>간증 피드 읽기</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>간증 글쓰기 (익명 포함)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>좋아요 · 댓글</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 간증은 모든 기능이 무료입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>커뮤니티 탭에서 간증 열기</p>
                        <p style={S.p}>
                            하단 <b>커뮤니티 탭</b>에서 <b>간증</b>으로 들어가세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/testimony/feed.png" alt="간증 피드 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>피드에서 간증 읽고 반응하기</p>
                        <p style={S.p}>
                            간증이 <b>카드 피드</b>로 쌓입니다. 각 카드에는 작성자 이름과 작성 시점,
                            공개 범위 배지(<b>전체</b>), 간증 제목과 내용이 보여요.
                            카드 아래의 <b>♡ 좋아요</b>와 <b>댓글</b> 버튼으로
                            함께 기뻐하고 격려의 말을 남길 수 있습니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>내 간증 올리기</p>
                        <p style={S.p}>
                            화면 오른쪽 위의 초록색 <b>[글쓰기]</b> 버튼을 누르면 새 간증을 작성할 수 있어요.
                            제목과 내용을 쓰고 올리면 피드에 공유됩니다.
                            조심스러운 이야기라면 <b>익명</b>으로 올려도 괜찮아요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 거창한 사건이 아니어도 좋아요 — <b>말씀 한 구절이 하루를 바꾼 이야기</b>도 소중한 간증입니다.<br />
                    💡 다른 분의 간증에 <b>댓글 한 줄</b>을 남겨보세요. 나누는 은혜가 두 배가 됩니다.<br />
                    💡 이름을 밝히기 어려운 이야기는 <b>익명</b>으로 나누세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
