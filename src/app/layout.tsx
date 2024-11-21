import "@/css/globals.css";
import "@/css/nprogress.css";
import Header from "@/components/header/Header";
import { fonts } from "../lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";

// export const runtime = "edge";

import type { Metadata } from "next";
import ThemeProvider from "./provider/ThemeProvider";
import GlobalProvider from "./provider/GlobalProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "YTyping",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesList = cookies();
  const colorMode = cookiesList.get("chakra-ui-color-mode");
  const session = await auth();

  return (
    <html lang="ja">
      <body className={fonts.rubik.variable}>
        <Analytics />
        <ThemeProvider colorMode={colorMode?.value}>
          <SessionProvider session={session}>
            <Header />
            <GlobalProvider>{children}</GlobalProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
