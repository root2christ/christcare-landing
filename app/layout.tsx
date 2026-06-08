import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'soluma — Find your light in Scripture',
  description: 'A spiritual growth app for Christians. C.H.R.I.S.T Test, daily devotion, Bible reading, small groups, prayer requests, and challenges. 크리스천을 위한 영적 성장 앱.',
  icons: { icon: '/app-icon.png', apple: '/app-icon.png' },
  openGraph: {
    title: 'soluma — Find your light in Scripture',
    description: 'A spiritual growth app for Christians · 크리스천을 위한 영적 성장 앱',
    url: 'https://christcare.us',
    siteName: 'soluma',
    images: ['/app-icon.png'],
    type: 'website',
  },
  verification: {
    google: '_zRU1MzFSJhHVTVmHTjnM4itiLzgXRSbqqBD1of8gIg',
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
