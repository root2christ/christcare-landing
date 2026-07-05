'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getQuestions, getTypeCode, UI, C, detectLang, type Lang, type Cat } from './christTest';

type Phase = 'intro' | 'test' | 'calc';

export default function TestClient() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('ko');
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [fade, setFade] = useState(true);

  useEffect(() => { setLang(detectLang()); }, []);

  const t = UI[lang];
  const questions = useMemo(() => getQuestions(lang), [lang]);
  const total = questions.length;
  const q = questions[idx];

  const finish = (ans: Record<number, number>) => {
    setPhase('calc');
    const scores: Record<Cat, number> = { C: 0, H: 0, R: 0, I: 0, S: 0, T: 0 };
    for (const question of questions) {
      const a = ans[question.id];
      if (typeof a === 'number') scores[question.category] += a;
    }
    const code = getTypeCode(scores);
    setTimeout(() => router.push(`/t/${code}?lang=${lang}`), 650);
  };

  const choose = (score: number) => {
    const next = { ...answers, [q.id]: score };
    setAnswers(next);
    setFade(false);
    setTimeout(() => {
      if (idx + 1 >= total) { finish(next); return; }
      setIdx(idx + 1);
      setFade(true);
    }, 200);
  };

  const goBack = () => {
    if (idx === 0) { setPhase('intro'); return; }
    setFade(false);
    setTimeout(() => { setIdx(idx - 1); setFade(true); }, 120);
  };

  const wrap: React.CSSProperties = {
    minHeight: '100dvh', background: C.cream, color: C.ink,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '0 20px', boxSizing: 'border-box',
  };

  return (
    <div style={wrap}>
      <style>{`
        @keyframes ctIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes ctPulse { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.06);} }
        .ct-opt:active { transform: scale(0.985); }
        .ct-opt { transition: background .15s, border-color .15s, transform .06s; }
        .ct-start:active { transform: translateY(1px); }
      `}</style>

      {/* 언어 토글 */}
      <button
        onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
        style={{
          position: 'fixed', top: 14, right: 16, zIndex: 5,
          background: C.white, border: `1px solid ${C.border}`, color: C.skyDeep,
          borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}
      >{t.langBtn}</button>

      {phase === 'intro' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: 460, animation: 'ctIn .5s ease' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.skyDeep, letterSpacing: 1, marginBottom: 14 }}>{t.kicker}</div>
          <div style={{ fontSize: 40, marginBottom: 6 }}>🕊️</div>
          <h1 style={{ fontSize: 34, fontWeight: 900, margin: '6px 0 14px' }}>{t.title}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: C.muted, whiteSpace: 'pre-line', margin: 0 }}>{t.subtitle}</p>
          <div style={{ fontSize: 13.5, color: C.faint, margin: '22px 0 34px', fontWeight: 600 }}>{t.meta}</div>
          <button
            className="ct-start"
            onClick={() => { setPhase('test'); setIdx(0); setFade(true); }}
            style={{
              background: `linear-gradient(180deg, ${C.sky}, ${C.skyDark})`, color: C.white, border: 'none',
              borderRadius: 18, padding: '17px 46px', fontSize: 17, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 10px 24px rgba(14,165,233,.32)',
            }}
          >{t.start}</button>
          <p style={{ fontSize: 13, color: C.faint, marginTop: 20, lineHeight: 1.5 }}>{t.intro2}</p>
        </div>
      )}

      {phase === 'test' && q && (
        <div style={{ width: '100%', maxWidth: 520, flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 64, paddingBottom: 28 }}>
          {/* 진행 바 */}
          <div style={{ height: 6, background: C.border, borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${((idx) / total) * 100}%`, height: '100%', background: `linear-gradient(90deg,${C.sky},${C.skyDeep})`, borderRadius: 999, transition: 'width .3s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: C.skyDeep, background: C.border, padding: '4px 11px', borderRadius: 999 }}>{t.part(q.category)}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.faint }}>{t.prog(idx + 1, total)}</span>
          </div>

          <div style={{ flex: 1, opacity: fade ? 1 : 0, transition: 'opacity .18s ease' }}>
            <h2 style={{ fontSize: 20.5, fontWeight: 800, lineHeight: 1.5, margin: '0 0 22px' }}>{q.question}</h2>

            {q.type === 'SCENARIO' && q.options ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {q.options.map((o, i) => (
                  <button
                    key={i}
                    className="ct-opt"
                    onClick={() => choose(o.score)}
                    style={{
                      textAlign: 'left', background: C.white, border: `1.5px solid ${C.border}`,
                      borderRadius: 15, padding: '15px 17px', fontSize: 15.5, lineHeight: 1.5, color: C.ink,
                      cursor: 'pointer', fontWeight: 500,
                    }}
                  >{o.text}</button>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 700, color: C.muted, marginBottom: 12 }}>
                  <span>{q.leftLabel}</span><span>{q.rightLabel}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      className="ct-opt"
                      onClick={() => choose(v)}
                      style={{
                        flex: 1, aspectRatio: '1', background: C.white, border: `1.5px solid ${C.border}`,
                        borderRadius: 15, fontSize: 18, fontWeight: 800, color: C.skyDeep, cursor: 'pointer',
                      }}
                    >{v}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.faint, marginTop: 8 }}>
                  <span>{t.agreeLeft}</span><span>{t.agreeRight}</span>
                </div>
              </div>
            )}
          </div>

          <button onClick={goBack} style={{ alignSelf: 'flex-start', marginTop: 20, background: 'none', border: 'none', color: C.faint, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← {t.back}</button>
        </div>
      )}

      {phase === 'calc' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 44, animation: 'ctPulse 1.1s ease-in-out infinite' }}>🕊️</div>
          <p style={{ fontSize: 16, color: C.muted, marginTop: 18, fontWeight: 600 }}>{t.calc}</p>
        </div>
      )}
    </div>
  );
}
