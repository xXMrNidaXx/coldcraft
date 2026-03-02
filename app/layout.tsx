import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ColdCraft - AI Cold Emails That Get Replies',
  description: 'Generate personalized cold emails in seconds. 3 variants per generation. Free to start.',
  keywords: ['cold email', 'AI email', 'sales email', 'email generator', 'outreach'],
  openGraph: {
    title: 'ColdCraft - AI Cold Emails That Get Replies',
    description: 'Generate personalized cold emails in seconds. Free to start.',
    url: 'https://coldcraft.revolutionai.io',
    siteName: 'ColdCraft',
    type: 'website',
    images: [{ url: 'https://coldcraft.revolutionai.io/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColdCraft - AI Cold Emails That Get Replies',
    description: 'Generate personalized cold emails in seconds. Free to start.',
    images: ['https://coldcraft.revolutionai.io/og'],
    creator: '@MyBossisAI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>{children}</body>
    </html>
  );
}
