import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
const poppins = Poppins({
  weight : ['300' , '400', '500' , '600' , '700'],
  subsets : ['latin'],
  display : 'swap',
  variable : '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Rise Invest - Venture Studio in Dubai',
  description: 'Building the future at the intersection of tech, capital, and culture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={poppins.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}