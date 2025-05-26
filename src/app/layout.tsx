
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CustomCursor from '@/components/custom-cursor';
import BubbleBackground from '@/components/effects/bubble-background';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Ventures AI - Data Analyst',
  description: 'Ventures AI - Powerful data analysis and insights for your business.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased"> 
        <BubbleBackground /> 
        {/* Main content wrapper: removed bg-background, added relative and z-index */}
        <div className="relative z-[1] flex flex-col min-h-screen overflow-x-hidden"> 
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
          <CustomCursor />
        </div>
      </body>
    </html>
  );
}
