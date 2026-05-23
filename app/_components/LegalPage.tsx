'use client';

import { useState, useMemo } from 'react';

/**
 * 간단한 마크다운 → JSX 변환 (의존성 없는 미니멀 파서)
 * 지원: # ## ### 헤딩, **bold**, *italic*, `code`, - 리스트, | 표 |, 빈줄=단락
 */
function renderMarkdown(md: string) {
    const lines = md.split('\n');
    const out: React.ReactNode[] = [];
    let i = 0;

    function inline(text: string): React.ReactNode {
        // **bold**, *italic*, `code`, [link](url)
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
            if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
            else if (m[3]) parts.push(<em key={key++}>{m[3]}</em>);
            else if (m[4]) parts.push(<code key={key++} className="px-1 py-0.5 bg-slate-100 rounded text-sm">{m[4]}</code>);
            else if (m[5] && m[6]) parts.push(<a key={key++} href={m[6]} className="text-indigo-600 underline">{m[5]}</a>);
            rest = rest.slice(m.index + m[0].length);
        }
        return <>{parts}</>;
    }

    while (i < lines.length) {
        const line = lines[i];
        // Headings
        if (line.startsWith('### ')) {
            out.push(<h3 key={i} className="text-lg font-bold mt-6 mb-2 text-slate-800">{inline(line.slice(4))}</h3>);
            i++;
            continue;
        }
        if (line.startsWith('## ')) {
            out.push(<h2 key={i} className="text-xl font-bold mt-8 mb-3 text-slate-900">{inline(line.slice(3))}</h2>);
            i++;
            continue;
        }
        if (line.startsWith('# ')) {
            out.push(<h1 key={i} className="text-3xl font-extrabold mt-8 mb-4 text-slate-900">{inline(line.slice(2))}</h1>);
            i++;
            continue;
        }
        // Horizontal rule
        if (line.trim() === '---') {
            out.push(<hr key={i} className="my-6 border-slate-200" />);
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
                <div key={`tbl-${i}`} className="overflow-x-auto my-4">
                    <table className="w-full border-collapse border border-slate-300 text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                {headerCells.map((h, k) => (
                                    <th key={k} className="border border-slate-300 px-3 py-2 text-left font-semibold">
                                        {inline(h)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, ri) => (
                                <tr key={ri}>
                                    {r.map((c, ci) => (
                                        <td key={ci} className="border border-slate-300 px-3 py-2">
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
                <ListTag key={`list-${i}`} className={`my-3 ml-6 ${isOrdered ? 'list-decimal' : 'list-disc'} space-y-1`}>
                    {items.map((it, k) => (
                        <li key={k} className="text-slate-700 leading-relaxed">{inline(it)}</li>
                    ))}
                </ListTag>,
            );
            continue;
        }
        // Blank line
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
            <p key={`p-${i}`} className="my-3 text-slate-700 leading-relaxed">
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
    const content = lang === 'ko' ? contentKo : contentEn;
    const rendered = useMemo(() => renderMarkdown(content), [content]);

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/" className="text-slate-600 hover:text-slate-900 text-sm font-semibold">
                        ← soluma
                    </a>
                    <h1 className="text-base font-bold text-slate-900">{title[lang]}</h1>
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setLang('ko')}
                            className={`px-2 py-1 rounded text-xs font-bold ${
                                lang === 'ko' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
                            }`}
                        >
                            한
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`px-2 py-1 rounded text-xs font-bold ${
                                lang === 'en' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
                            }`}
                        >
                            EN
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 py-8 pb-20">
                {rendered}
            </main>
            <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
                © 2026 ROOT CO., Ltd · master@root2christ.com
            </footer>
        </div>
    );
}
