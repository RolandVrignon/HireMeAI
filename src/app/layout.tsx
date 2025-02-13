import type { Metadata } from "next";
import { ThemeProvider } from '@/providers/theme-provider'
import "./globals.css";

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
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
      <html lang="en" suppressHydrationWarning className={`${roboto.variable}`}>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=Righteous&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
          <script 
            type="text/javascript" 
            src="https://assets.calendly.com/assets/external/widget.js" 
            async
          />
        </head>
        <body className={roboto.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
  );
}
