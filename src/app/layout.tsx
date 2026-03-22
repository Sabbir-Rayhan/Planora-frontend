import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Providers from '@/components/shared/Providers';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Planora — Event Management Platform',
  description: 'Create, manage and join events easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={geist.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}