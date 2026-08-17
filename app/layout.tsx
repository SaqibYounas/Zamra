import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { ClientProviders } from './src/components/providers/ClientProviders';
import { themeInitScript } from './src/lib/theme';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zamra Water Plant Admin',
    template: '%s · Zamra Water Plant',
  },
  description:
    'Monitor, manage, and optimize your water plant operations in one unified platform.',
  applicationName: 'Zamra Water Plant',
  authors: [{ name: 'Sufyan Malik' }],
  icons: {
    icon: '/Logo.jpg',
    apple: '/Logo.jpg',
  },
  openGraph: {
    title: 'Zamra Water Plant Admin',
    description:
      'Monitor, manage, and optimize your water plant operations in one unified platform.',
    siteName: 'Zamra Water Plant',
    type: 'website',
    images: ['/Logo.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#f4f7fb',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#0a1622',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>

      <body className="min-h-full bg-canvas font-sans text-ink">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
