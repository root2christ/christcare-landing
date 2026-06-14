import type { Metadata } from 'next';
import { SLIDES } from '../_content';

export const metadata: Metadata = {
    title: 'soluma 발표 전체 슬라이드 (검토용)',
    description: '발표 내용 전체 읽기 — 검토 및 수정 제안용',
};

// 발표자가 발표 전 전체 슬라이드 내용을 한 번에 읽으며 검토하는 페이지.
// 슬라이드 번호가 표시되어, 수정 제안 시 "N번 슬라이드"로 지목할 수 있다. 정적 서버 컴포넌트.

const NAVY = '#0f172a';
const BLUE = '#4f6ef2';

const KIND_LABEL: Record<string, string> = {
    cover: '표지', narrative: '이야기', feature: '기능', grid: '기능 그리드', divider: '구분', closing: '마무리',
    info: '정보', 'q-single': '설문', 'q-multi': '설문', 'q-text': '설문',
};

export default function AllSlidesPage() {
    return (
        <div style={{ minHeight: '100dvh', background: '#fbfbfd', padding: '30px 16px 70px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 900, color: BLUE, letterSpacing: 1 }}>발표자 검토용 · 전체 {SLIDES.length}장</div>
                    <h1 style={{ fontSize: 25, fontWeight: 900, color: NAVY, margin: '6px 0 0', lineHeight: 1.3 }}>발표 슬라이드 전체 내용</h1>
                    <p style={{ fontSize: 14, color: '#64748b', marginTop: 10, lineHeight: 1.65 }}>
                        아래로 쭉 내리며 내용을 검토해 주세요. 고칠 부분이 있으면 <b style={{ color: NAVY }}>「N번 슬라이드」</b> 번호와 함께
                        카톡으로 알려주시면 즉시 반영됩니다.
                    </p>
                </div>

                {SLIDES.map((s, i) => (
                    <div key={s.id} style={{ marginTop: 14, background: '#fff', border: '1px solid #eef0f6', borderRadius: 16, padding: '18px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <span style={{ flexShrink: 0, minWidth: 30, height: 26, padding: '0 9px', borderRadius: 999, background: NAVY, color: '#fff', fontSize: 13.5, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8' }}>{KIND_LABEL[s.kind] || s.kind}</span>
                            {s.eyebrow && <span style={{ fontSize: 12.5, fontWeight: 800, color: BLUE }}>· {s.eyebrow}</span>}
                        </div>

                        {s.title && (
                            <h2 style={{ fontSize: 19, fontWeight: 900, color: NAVY, margin: '0 0 8px', lineHeight: 1.4 }}>
                                {s.emoji ? `${s.emoji} ` : ''}{s.title}
                            </h2>
                        )}

                        {s.body?.map((b, j) => (
                            <p key={j} style={{ fontSize: 15, color: '#334155', lineHeight: 1.75, margin: '8px 0 0' }}>{b}</p>
                        ))}

                        {s.bullets && (
                            <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none' }}>
                                {s.bullets.map((b, j) => (
                                    <li key={j} style={{ display: 'flex', gap: 9, fontSize: 14.5, color: '#334155', lineHeight: 1.6, marginBottom: 6 }}>
                                        <span style={{ color: BLUE, fontWeight: 900 }}>·</span><span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {s.grid && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                                {s.grid.map((g, j) => (
                                    <span key={j} style={{ fontSize: 13, fontWeight: 700, color: BLUE, background: '#eef2ff', borderRadius: 8, padding: '5px 10px' }}>{g.emoji} {g.label}</span>
                                ))}
                            </div>
                        )}

                        {s.quote && (
                            <div style={{ marginTop: 12, borderLeft: `4px solid ${BLUE}`, background: '#f5f7ff', borderRadius: '0 10px 10px 0', padding: '10px 14px', fontSize: 14.5, color: '#1e293b', fontWeight: 700, lineHeight: 1.6 }}>
                                “{s.quote}”
                            </div>
                        )}

                        {s.qr && (
                            <div style={{ marginTop: 10, fontSize: 12.5, color: '#94a3b8', fontWeight: 700 }}>🔳 (이 슬라이드에는 설문 QR이 자동 표시됩니다)</div>
                        )}
                    </div>
                ))}

                <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12.5, color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>
                    ROOT &amp; SOLUMA · 검토용 전체 보기
                </p>
            </div>
        </div>
    );
}
