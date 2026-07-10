import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from './src/components/ClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zamra Water Plant Admin',
  description:
    'Monitor, manage, and optimize your water plant operations in one unified platform.',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/Logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta property="og:title" content="Zamra Water Plant Admin" />
        <meta
          property="og:description"
          content="Monitor, manage, and optimize your water plant operations in one unified platform."
        />
        <meta property="og:image" content="/Logo.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Zamra Water Plant" />
        <meta name="author" content="Owner: Sufyan Malik" />
      </head>
      <body className="min-h-full flex flex-col font-sans ">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
