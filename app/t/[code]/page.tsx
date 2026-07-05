import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pick, type Lang, type ResultData } from '../christTest';
import results from '../../../lib/ctResults.json';
import ResultClient from './ResultClient';

const RESULTS = results as Record<string, ResultData>;
const asLang = (v?: string): Lang => (v === 'en' ? 'en' : 'ko');

type Props = { params: { code: string }; searchParams: { lang?: string } };

export function generateMetadata({ params, searchParams }: Props): Metadata {
  const code = decodeURIComponent(params.code).toUpperCase();
  const lang = asLang(searchParams?.lang);
  const r = RESULTS[code];
  if (!r) return { title: '크라이스트 테스트 · Christ Test | soluma' };
  const model = pick(r, 'model', lang);
  const reveal = pick(r, 'reveal', lang);
  const title = lang === 'en' ? `You are ${model} · Christ Test` : `당신은 ‘${model}’ · 크라이스트 테스트`;
  const url = `https://christcare.us/t/${code}?lang=${lang}`;
  const ogImage = `https://christcare.us/ct/og/${code}.jpg`;
  return {
    title,
    description: reveal,
    openGraph: { title, description: reveal, url, siteName: 'soluma', type: 'website', images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description: reveal, images: [ogImage] },
  };
}

export default function Page({ params, searchParams }: Props) {
  const code = decodeURIComponent(params.code).toUpperCase();
  const lang = asLang(searchParams?.lang);
  const r = RESULTS[code];
  if (!r) redirect('/t');
  return <ResultClient code={code} lang={lang} data={r} />;
}
