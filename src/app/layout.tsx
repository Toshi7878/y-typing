import "./globals.css";
import Header from "@/components/header/Header";

import { fonts } from "./fonts";
import "@/app/nprogress.css";
import { Analytics } from "@vercel/analytics/react";

// export const runtime = "edge";

import type { Metadata } from "next";
import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
  title: "YTyping",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={fonts.rubik.variable}>
        <Analytics />
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
