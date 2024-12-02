import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import ModalProvider from '@/components/providers/modal-providers';

export const metadata: Metadata = {
  title: 'Hotel Ops Management',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='flex flex-col'>
              <Navbar />
              <div className='flex-1'>{children}</div>
            </div>
            <Toaster />
            <ModalProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
