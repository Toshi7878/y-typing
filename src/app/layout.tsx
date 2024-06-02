import "./globals.css";
import Header from "@/components/header/Header";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import { metadata } from "./metadata";
// export const runtime = "edge";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={fonts.rubik.variable}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
