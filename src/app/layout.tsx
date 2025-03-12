import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Open_Sans } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import {Toaster} from '@/components/ui/sonner'
import './globals.css'



const OpenSans = Open_Sans({
  variable: "--font-Open_Sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MDO Student Living",
  description: "A modern student living management applicationp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${OpenSans.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
