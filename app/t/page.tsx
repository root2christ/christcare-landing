import type { Metadata } from 'next';
import TestClient from './TestClient';

export const metadata: Metadata = {
  title: '크라이스트 테스트 · Christ Test | soluma',
  description: '성경 속 64명의 인물 중 나와 가장 닮은 사람은? 약 3분, 30문항 무료 테스트. Which of 64 Bible figures are you most like?',
  openGraph: {
    title: '크라이스트 테스트 · Christ Test',
    description: '성경 속 64명의 인물 중, 나와 가장 닮은 사람은 누구일까요? · Which Bible figure are you?',
    url: 'https://christcare.us/t',
    siteName: 'soluma',
    images: ['/app-icon.png'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: '크라이스트 테스트 · Christ Test', description: '성경 속 나와 닮은 인물 찾기' },
};

export default function Page() {
  return <TestClient />;
}
