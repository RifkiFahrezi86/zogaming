import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { DataProvider } from '@/lib/DataContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'ZOGAMING - Best Gaming Shop',
  description: 'ZOGAMING is your one-stop destination for the best video games. Browse our collection of action, adventure, strategy, and racing games.',
  keywords: ['gaming', 'video games', 'game shop', 'action games', 'adventure games'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
