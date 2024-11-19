import "@/css/globals.css";
import "@/css/nprogress.css";
import Header from "@/components/header/Header";
import { fonts } from "../lib/fonts";
import { Analytics } from "@vercel/analytics/react";

// export const runtime = "edge";

import type { Metadata } from "next";
import ThemeProvider from "./provider/ThemeProvider";
import GlobalProvider from "./provider/GlobalProvider";
import { ColorModeScript } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "YTyping",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const theme = getTheme("dark");

  return (
    <html lang="ja">
      <head>
        <ColorModeScript initialColorMode={"dark"} />
      </head>
      <body className={fonts.rubik.variable}>
        <Analytics />
        <ThemeProvider>
          <Header />
          <GlobalProvider>{children}</GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
