import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YT Chatbot — Chat with any YouTube Video',
  description:
    'Ask questions about any YouTube video and get AI-powered answers from the transcript. Powered by LangChain RAG pipeline.',
  keywords: ['youtube', 'chatbot', 'ai', 'transcript', 'rag', 'langchain'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
