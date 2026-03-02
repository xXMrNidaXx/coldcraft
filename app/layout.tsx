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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ColdCraft',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI-powered cold email generator. Get 3 personalized email variants in seconds.',
  url: 'https://coldcraft.revolutionai.io',
  author: {
    '@type': 'Organization',
    name: 'RevolutionAI',
    url: 'https://revolutionai.io',
  },
  offers: {
    '@type': 'Offer',
    price: '9.00',
    priceCurrency: 'USD',
    priceValidUntil: '2027-12-31',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    ratingCount: '89',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
