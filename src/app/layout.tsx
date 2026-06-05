import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "展飞智媒 | Zhanfei Media",
  description:
    "AI Native 时代的产品发现引擎。每一个值得被看见的 AI 产品和时刻，都在这里。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
