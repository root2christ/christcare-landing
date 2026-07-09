'use client';

import { useState, useMemo, useEffect } from 'react';

/**
 * 간단한 마크다운 → JSX 변환 (의존성 없는 미니멀 파서)
 * 지원: # ## ### 헤딩, **bold**, *italic*, `code`, - 리스트, | 표 |, 빈줄=단락
 * ⚠️ 이 프로젝트에는 Tailwind가 없음 — 모든 스타일은 인라인으로.
 */

const C = {
    text: '#334155',
    heading: '#0f172a',
    sub: '#64748b',
    border: '#e2e8f0',
    tableBorder: '#cbd5e1',
    tableHead: '#f1f5f9',
    codeBg: '#f1f5f9',
    link: '#4f46e5',
};

const FONT =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";

function renderMarkdown(md: string) {
    const lines = md.split('\n');
    const out: React.ReactNode[] = [];
    let i = 0;

    function inline(text: string): React.ReactNode {
        const parts: React.ReactNode[] = [];
        let rest = text;
        let key = 0;
        const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/;
        while (rest.length) {
            const m = regex.exec(rest);
            if (!m) {
                parts.push(rest);
                break;
            }
            if (m.index > 0) parts.push(rest.slice(0, m.index));
            if (m[2]) parts.push(<strong key={key++} style={{ color: C.heading }}>{m[2]}</strong>);
            else if (m[3]) parts.push(<em key={key++}>{m[3]}</em>);
            else if (m[4]) parts.push(
                <code key={key++} style={{ padding: '2px 6px', background: C.codeBg, borderRadius: 4, fontSize: 13 }}>{m[4]}</code>
            );
            else if (m[5] && m[6]) parts.push(
                <a key={key++} href={m[6]} style={{ color: C.link, textDecoration: 'underline' }}>{m[5]}</a>
            );
            rest = rest.slice(m.index + m[0].length);
        }
        return <>{parts}</>;
    }

    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('### ')) {
            out.push(<h3 key={i} style={{ fontSize: 17, fontWeight: 700, margin: '24px 0 8px', color: C.heading }}>{inline(line.slice(4))}</h3>);
            i++;
            continue;
        }
        if (line.startsWith('## ')) {
            out.push(<h2 key={i} style={{ fontSize: 20, fontWeight: 700, margin: '36px 0 12px', color: C.heading, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>{inline(line.slice(3))}</h2>);
            i++;
            continue;
        }
        if (line.startsWith('# ')) {
            out.push(<h1 key={i} style={{ fontSize: 26, fontWeight: 800, margin: '28px 0 14px', color: C.heading, letterSpacing: -0.3 }}>{inline(line.slice(2))}</h1>);
            i++;
            continue;
        }
        if (line.trim() === '---') {
            out.push(<hr key={i} style={{ margin: '24px 0', border: 'none', borderTop: `1px solid ${C.border}` }} />);
            i++;
            continue;
        }
        // Table
        if (line.startsWith('|') && lines[i + 1]?.match(/^\|[\s\-:|]+\|$/)) {
            const headerCells = line.split('|').slice(1, -1).map((c) => c.trim());
            i += 2;
            const rows: string[][] = [];
            while (i < lines.length && lines[i].startsWith('|')) {
                rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
                i++;
            }
            out.push(
                <div key={`tbl-${i}`} style={{ overflowX: 'auto', margin: '16px 0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead style={{ background: C.tableHead }}>
                            <tr>
                                {headerCells.map((h, k) => (
                                    <th key={k} style={{ border: `1px solid ${C.tableBorder}`, padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: C.heading }}>
                                        {inline(h)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, ri) => (
                                <tr key={ri}>
                                    {r.map((c, ci) => (
                                        <td key={ci} style={{ border: `1px solid ${C.tableBorder}`, padding: '8px 12px', color: C.text }}>
                                            {inline(c)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>,
            );
            continue;
        }
        // List
        if (line.startsWith('- ') || line.match(/^\d+\. /)) {
            const items: string[] = [];
            const isOrdered = !!line.match(/^\d+\. /);
            while (i < lines.length && (lines[i].startsWith('- ') || lines[i].match(/^\d+\. /))) {
                items.push(lines[i].replace(/^(- |\d+\. )/, ''));
                i++;
            }
            const ListTag = isOrdered ? 'ol' : 'ul';
            out.push(
                <ListTag key={`list-${i}`} style={{ margin: '12px 0', paddingLeft: 26, listStyleType: isOrdered ? 'decimal' : 'disc' }}>
                    {items.map((it, k) => (
                        <li key={k} style={{ color: C.text, lineHeight: 1.75, marginBottom: 4 }}>{inline(it)}</li>
                    ))}
                </ListTag>,
            );
            continue;
        }
        if (line.trim() === '') {
            i++;
            continue;
        }
        // Paragraph (merge consecutive non-blank lines)
        const paraLines: string[] = [line];
        i++;
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !lines[i].startsWith('#') &&
            !lines[i].startsWith('- ') &&
            !lines[i].match(/^\d+\. /) &&
            !lines[i].startsWith('|') &&
            lines[i].trim() !== '---'
        ) {
            paraLines.push(lines[i]);
            i++;
        }
        out.push(
            <p key={`p-${i}`} style={{ margin: '12px 0', color: C.text, lineHeight: 1.75 }}>
                {paraLines.map((pl, k) => (
                    <span key={k}>
                        {inline(pl)}
                        {k < paraLines.length - 1 && <br />}
                    </span>
                ))}
            </p>,
        );
    }
    return out;
}

export default function LegalPage({
    title,
    contentKo,
    contentEn,
    defaultLang = 'ko',
}: {
    title: { ko: string; en: string };
    contentKo: string;
    contentEn: string;
    defaultLang?: 'ko' | 'en';
}) {
    const [lang, setLang] = useState<'ko' | 'en'>(defaultLang);

    // ?lang=en 쿼리 우선, 없으면 브라우저 언어 자동 감지 (해외 심사관/사용자는 영어로 시작)
    useEffect(() => {
        try {
            const q = new URLSearchParams(window.location.search).get('lang');
            if (q === 'en' || q === 'ko') {
                setLang(q);
            } else if (!navigator.language?.toLowerCase().startsWith('ko')) {
                setLang('en');
            }
        } catch { /* noop */ }
    }, []);

    const content = lang === 'ko' ? contentKo : contentEn;
    const rendered = useMemo(() => renderMarkdown(content), [content]);

    const pill = (active: boolean): React.CSSProperties => ({
        padding: '6px 14px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        background: active ? '#ffffff' : 'transparent',
        color: active ? C.heading : C.sub,
        boxShadow: active ? '0 1px 3px rgba(15,23,42,0.15)' : 'none',
    });

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: FONT }}>
            <header style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: 'rgba(255,255,255,0.97)',
                borderBottom: `1px solid ${C.border}`,
            }}>
                <div style={{
                    maxWidth: 760, margin: '0 auto', padding: '14px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                    <a href="/" style={{ color: C.sub, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        ← soluma
                    </a>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.heading, textAlign: 'center' }}>{title[lang]}</div>
                    <div style={{ display: 'flex', gap: 2, background: C.tableHead, borderRadius: 10, padding: 3 }}>
                        <button onClick={() => setLang('ko')} style={pill(lang === 'ko')}>한국어</button>
                        <button onClick={() => setLang('en')} style={pill(lang === 'en')}>EN</button>
                    </div>
                </div>
            </header>
            <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 80px' }}>
                {rendered}
            </main>
            <footer style={{
                borderTop: `1px solid ${C.border}`, padding: '24px 20px',
                textAlign: 'center', fontSize: 12, color: C.sub,
            }}>
                © 2026 ROOT CO., Ltd · master@root2christ.com
            </footer>
        </div>
    );
}
