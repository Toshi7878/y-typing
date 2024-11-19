import "./globals.css";
import Header from "@/components/header/Header";

import { fonts } from "./fonts";
import "@/app/nprogress.css";
import { Analytics } from "@vercel/analytics/react";

// export const runtime = "edge";

import type { Metadata } from "next";
import { GlobalProvider } from "./GlobalProvider";

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
        <GlobalProvider>
          <Header />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
