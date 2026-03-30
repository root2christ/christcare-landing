import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '예닮 - 예수님을 닮아가는 여정',
  description: '크리스천을 위한 영적 성장 앱. 크라이스트 테스트, 매일 큐티, 성경 통독, 소그룹, 기도요청, 챌린지.',
  openGraph: {
    title: '예닮 - 예수님을 닮아가는 여정',
    description: '크리스천을 위한 영적 성장 앱',
    url: 'https://christcare.us',
    siteName: '예닮',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
