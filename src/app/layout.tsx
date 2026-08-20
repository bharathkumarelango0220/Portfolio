import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ApexAssure — High-Converting Websites & Digital Platforms | Bharathkumar E',
  description:
    'ApexAssure Studio by Bharathkumar E. Delivering executive-grade, high-converting, risk-free web platforms and custom SaaS applications.',
  keywords: [
    'ApexAssure',
    'Bharathkumar E',
    'Fullstack Developer',
    'Web Design Studio',
    'Trip Tools',
    'High Converting Websites',
    'Next.js Fullstack',
  ],
  authors: [{ name: 'Bharathkumar E' }],
  openGraph: {
    title: 'ApexAssure — Websites That Build Trust. Brands That Stand Out.',
    description:
      'Executive-grade web design & fullstack engineering by Bharathkumar E.',
    url: 'https://apexassurein.vercel.app',
    siteName: 'ApexAssure',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1747633130999-dbf3527b0639?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'ApexAssure Studio Workspace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import { ThemeStudioModal } from '@/components/ThemeStudioModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300">
        <ThemeProvider>
          {children}
          <ThemeStudioModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
