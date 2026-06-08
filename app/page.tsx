import { headers } from 'next/headers';
import Landing from './_components/Landing';

export default function Home() {
  // Accept-Language 헤더로 기본 언어 결정: 한국어 사용자면 ko, 그 외(미국 등)는 en
  const accept = headers().get('accept-language')?.toLowerCase() || '';
  const initialLang = accept.startsWith('ko') || accept.includes('ko-') ? 'ko' : 'en';
  return <Landing initialLang={initialLang} />;
}
