import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Context-GC",
  description: "Context-GC is a zero-dependency Python library that deterministically prunes and compacts AI agent execution traces, with every pruned event recoverable via receipts.",
  keywords: ["Context-GC", "AI Agents", "Context Compaction", "LLM History Compression", "Deterministic GC", "Graph Pruning", "Python Library"],
  authors: [{ name: "Athish M" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Context-GC",
    description: "Context-GC is a zero-dependency Python library that deterministically prunes and compacts AI agent execution traces, with every pruned event recoverable via receipts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-space text-text-primary selection:bg-brand-blue/20 selection:text-brand-blue">
        {children}
      </body>
    </html>
  );
}
