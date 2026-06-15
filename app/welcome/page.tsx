'use client';

// 목회자 자문회 참석 목사님 전용 허브.
// 로그인(설문과 동일한 이름+휴대폰 신원) → 발표 다시보기 / 앱 설치 / 설문(저장된 답변 이어쓰기).
// 설문과 동일한 localStorage uid 키를 설정하므로, '설문 작성'으로 들어가면 서버에 저장된 응답이 자동 연동된다.

import { useEffect, useMemo, useState } from 'react';
import { TESTFLIGHT_URL, ANDROID_APK_URL } from '../survey/_content';

const NAVY = '#0f172a';
const BLUE = '#4f6ef2';
const BORDER = '#e2e8f0';

// ⚠️ 설문(SurveyForm)과 반드시 동일해야 연동됨
const LS_UID = 'soluma_survey_uid_v1';
const LS_DATA = 'soluma_survey_data_v1';

const phoneDigits = (s: string) => (s || '').replace(/\D/g, '');

function detectOS(): 'ios' | 'android' | 'other' {
    if (typeof navigator === 'undefined') return 'other';
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'other';
}

function hasAnswers(srv: any): boolean {
    if (!srv) return false;
    const a = srv.answers && typeof srv.answers === 'object' ? Object.keys(srv.answers).length : 0;
    const m = srv.christ_memos && typeof srv.christ_memos === 'object' ? Object.keys(srv.christ_memos).length : 0;
    return a > 0 || m > 0;
}

export default function WelcomePage() {
    const [loaded, setLoaded] = useState(false);
    const [identified, setIdentified] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [pastorName, setPastorName] = useState('');
    const [hasSurvey, setHasSurvey] = useState(false);
    const os = useMemo(detectOS, []);

    // 같은 기기에서 이미 신원 있으면 자동 로그인
    useEffect(() => {
        let uid = '';
        try { uid = localStorage.getItem(LS_UID) || ''; } catch { /* noop */ }
        if (uid && uid.startsWith('p:')) {
            fetch(`/api/survey?uid=${encodeURIComponent(uid)}`)
                .then((r) => r.json())
                .then((d) => { const srv = d?.response; setPastorName(srv?.name || ''); setHasSurvey(hasAnswers(srv)); })
                .catch(() => { /* noop */ })
                .finally(() => { setIdentified(true); setLoaded(true); });
        } else {
            setLoaded(true);
        }
    }, []);

    const enter = async () => {
        const nm = name.trim();
        const digits = phoneDigits(phone);
        if (!nm) { setErr('성함을 입력해 주세요.'); return; }
        if (digits.length < 9) { setErr('휴대폰 번호를 정확히 입력해 주세요. (숫자 9자리 이상)'); return; }
        setErr(''); setBusy(true);
        const uid = 'p:' + digits;
        // 설문과 동일 신원 설정 → '설문 작성'에서 자동 이어쓰기. 기기 캐시는 비워 서버값으로 새로 로드
        try { localStorage.setItem(LS_UID, uid); localStorage.removeItem(LS_DATA); } catch { /* noop */ }
        try {
            const r = await fetch(`/api/survey?uid=${encodeURIComponent(uid)}`);
            const d = await r.json();
            const srv = d?.response;
            setPastorName(srv?.name || nm);
            setHasSurvey(hasAnswers(srv));
        } catch {
            setPastorName(nm); setHasSurvey(false);
        } finally {
            setBusy(false); setIdentified(true);
        }
    };

    const reset = () => {
        try { localStorage.removeItem(LS_UID); localStorage.removeItem(LS_DATA); } catch { /* noop */ }
        setIdentified(false); setName(''); setPhone(''); setErr(''); setPastorName(''); setHasSurvey(false);
    };

    if (!loaded) return <div style={{ minHeight: '100dvh', background: '#0b1220' }} />;

    // ── 로그인(이름+휴대폰) ──
    if (!identified) {
        return (
            <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#0b1220,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
                <div style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', width: '100%', maxWidth: 400, boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 22 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/app-icon.png" alt="soluma" width={60} height={60} style={{ borderRadius: 14, marginBottom: 14 }} />
                        <h1 style={{ fontSize: 21, fontWeight: 900, color: NAVY, margin: 0 }}>목회자 자문회 · 참석 감사</h1>
                        <p style={{ fontSize: 14, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>
                            성함과 휴대폰 번호를 입력해 주세요.<br />
                            <strong style={{ color: BLUE }}>설문에 입력하신 번호</strong>와 같으면 작성하시던 응답이 그대로 이어집니다.
                        </p>
                    </div>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="성함 (예: 홍길동 목사)"
                        style={gateInput} />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호 (예: 010-1234-5678)"
                        type="tel" inputMode="tel" onKeyDown={(e) => { if (e.key === 'Enter') enter(); }} style={gateInput} />
                    {err && <p style={{ color: '#dc2626', fontSize: 13.5, margin: '2px 0 10px' }}>{err}</p>}
                    <button onClick={enter} disabled={busy}
                        style={{ width: '100%', height: 54, borderRadius: 14, border: 'none', background: NAVY, color: '#fff', fontSize: 16.5, fontWeight: 800, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                        {busy ? '확인 중…' : '입장 →'}
                    </button>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12, textAlign: 'center', lineHeight: 1.6 }}>번호는 본인 확인과 이어쓰기에만 사용됩니다.</p>
                </div>
            </div>
        );
    }

    // ── 허브 ──
    const dimIos = os === 'android';
    const dimAndroid = os === 'ios';

    return (
        <div style={{ minHeight: '100dvh', background: '#fbfbfd', color: NAVY }}>
            {/* 헤더 */}
            <div style={{ background: 'linear-gradient(160deg,#0b1220,#1e293b)', color: '#fff', padding: '34px 20px 28px', textAlign: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app-icon.png" alt="soluma" width={56} height={56} style={{ borderRadius: 14, marginBottom: 12 }} />
                <h1 style={{ fontSize: 23, fontWeight: 900, margin: 0, lineHeight: 1.4 }}>
                    {pastorName ? `${pastorName}님, 감사합니다 🌿` : '참석해 주셔서 감사합니다 🌿'}
                </h1>
                <p style={{ fontSize: 14.5, color: '#cbd5e1', marginTop: 10, lineHeight: 1.7 }}>
                    목회자 자문회에 함께해 주셔서 진심으로 감사드립니다.<br />아래에서 발표를 다시 보고, 앱을 설치하고, 설문을 이어서 작성하실 수 있습니다.
                </p>
                <button onClick={reset} style={{ marginTop: 14, fontSize: 12.5, color: '#94a3b8', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>다른 분으로 입장</button>
            </div>

            <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px 60px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 1. 발표 다시보기 */}
                <a href="/advisory" style={cardLink}>
                    <div style={{ ...iconBox, background: '#eef2ff', color: BLUE }}>🎬</div>
                    <div style={{ flex: 1 }}>
                        <div style={cardTitle}>발표 슬라이드 다시보기</div>
                        <div style={cardDesc}>처음부터 끝까지 자유롭게 넘겨보실 수 있어요.</div>
                    </div>
                    <span style={chev}>›</span>
                </a>

                {/* 2. 앱 설치 */}
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '18px 18px' }}>
                    <div style={cardTitle}>📱 솔루마 앱 설치</div>
                    <div style={{ ...cardDesc, marginBottom: 14 }}>직접 둘러보신 뒤의 의견이 가장 소중합니다.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                        <a href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer" style={installBtn(!dimIos, false)}>
                            <span style={{ fontSize: 20 }}>🍎</span>
                            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.25 }}>
                                <span style={{ fontSize: 15.5, fontWeight: 900 }}>iPhone — TestFlight로 설치</span>
                                <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>아이폰 사용자{os === 'ios' ? ' · 추천' : ''}</span>
                            </span>
                        </a>
                        <a href={ANDROID_APK_URL} target="_blank" rel="noopener noreferrer" style={installBtn(!dimAndroid, true)}>
                            <span style={{ fontSize: 20 }}>🤖</span>
                            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.25 }}>
                                <span style={{ fontSize: 15.5, fontWeight: 900 }}>Android — APK 설치</span>
                                <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>안드로이드 사용자{os === 'android' ? ' · 추천' : ''}</span>
                            </span>
                        </a>
                    </div>
                    {os !== 'ios' && (
                        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: '12px 2px 0' }}>
                            💡 안드로이드는 받은 파일을 열어 설치합니다. 처음이면 “출처를 알 수 없는 앱 설치 허용”을 한 번 켜 주세요.
                        </p>
                    )}
                </div>

                {/* 2-1. 프리미엄 선물 코드 */}
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 18, padding: '18px 18px' }}>
                    <div style={cardTitle}>🎁 프리미엄 1년 무료 이용</div>
                    <div style={{ ...cardDesc, marginBottom: 12 }}>참석해 주신 목사님께 드리는 선물입니다. 앱 설치 후 아래 코드를 입력하시면 프리미엄 구독이 적용됩니다.</div>
                    <div style={{ background: '#fff', border: '1.5px dashed #f59e0b', borderRadius: 12, padding: '12px 14px', marginBottom: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: '#b45309', letterSpacing: 0.5, marginBottom: 4 }}>선물 코드</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#92400e', letterSpacing: 3 }}>PASTOR2026</div>
                    </div>
                    <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75 }}>
                        앱에서 <b style={{ color: NAVY }}>my</b> → <b style={{ color: NAVY }}>선물하기</b> → <b style={{ color: NAVY }}>코드 입력</b> 칸에{' '}
                        <b style={{ color: '#b45309' }}>PASTOR2026</b> 을(를) 입력하시면 앱의 모든 기능을 사용하실 수 있습니다.
                    </div>
                </div>

                {/* 3. 설문 (이어쓰기 연동) */}
                <a href="/survey" style={{ ...cardLink, background: hasSurvey ? '#ecfdf5' : '#fff', borderColor: hasSurvey ? '#a7f3d0' : BORDER }}>
                    <div style={{ ...iconBox, background: hasSurvey ? '#d1fae5' : '#fef3c7', color: hasSurvey ? '#059669' : '#d97706' }}>📝</div>
                    <div style={{ flex: 1 }}>
                        <div style={cardTitle}>{hasSurvey ? '자문 설문 이어서 작성하기' : '자문 설문 작성하기'}</div>
                        <div style={cardDesc}>
                            {hasSurvey
                                ? '작성하시던 응답이 저장되어 있어요. 이어서 마무리해 주세요.'
                                : '발표 내용에 대한 목사님의 고견을 들려주세요. 자동 저장됩니다.'}
                        </div>
                    </div>
                    <span style={chev}>›</span>
                </a>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 6, fontWeight: 700, letterSpacing: 1 }}>ROOT &amp; SOLUMA</p>
            </div>
        </div>
    );
}

const gateInput: React.CSSProperties = { width: '100%', height: 52, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16.5, marginBottom: 10, boxSizing: 'border-box' };
const cardLink: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: NAVY, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, padding: '18px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' };
const iconBox: React.CSSProperties = { width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 };
const cardTitle: React.CSSProperties = { fontSize: 17, fontWeight: 900, color: NAVY, lineHeight: 1.35 };
const cardDesc: React.CSSProperties = { fontSize: 13.5, color: '#64748b', marginTop: 4, lineHeight: 1.6 };
const chev: React.CSSProperties = { fontSize: 26, color: '#cbd5e1', fontWeight: 700, flexShrink: 0 };

function installBtn(highlight: boolean, android: boolean): React.CSSProperties {
    return {
        display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', padding: '13px 16px', borderRadius: 14,
        background: highlight ? (android ? '#1f2937' : '#000') : '#fff',
        color: highlight ? '#fff' : '#94a3b8',
        border: highlight ? 'none' : `1.5px solid ${BORDER}`,
        opacity: highlight ? 1 : 0.6, minHeight: 54,
    };
}
