import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lotus Events',
  description: 'Event Management & Catering System',
  manifest: '/manifest.webmanifest',
  themeColor: '#050505',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lotus Events',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-512.png" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
