import type { Metadata } from 'next';
import './globals.css';
import { SiteUIProvider } from '@/components/SiteUIProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: '김성현 | Ricky Kim — 로봇·PLC 글로벌 자동화 아키텍트 (2026)',
  description:
    '로봇·PLC 글로벌 자동화 전문가로의 여정. 현장을 움직이는 글로벌 실무자 김성현(Ricky Kim)의 통합 포트폴리오 웹앱.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans bg-surface text-on-surface antialiased min-h-screen flex flex-col">
        <SiteUIProvider>
          <SiteHeader />
          <main className="flex-1 w-full pt-14 bg-surface">{children}</main>
          <SiteFooter />
        </SiteUIProvider>
      </body>
    </html>
  );
}
