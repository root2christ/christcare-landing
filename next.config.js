/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // .well-known 파일들을 public에서 서빙
    ];
  },
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
