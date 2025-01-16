import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from '@/providers/theme-provider'
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Chat With Me Before Hiring Me",
  description: "Chat With Me Before Hiring Me is an interactive chatbot powered by AI, which allows users to upload their resumes in different languages ...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=Righteous&display=swap" rel="stylesheet"></link>
        </head>
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
