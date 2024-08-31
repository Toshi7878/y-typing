import { SessionProvider } from "next-auth/react";
import Content from "./components/Content";
import EditProvider from "./components/EditProvider";
import { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: `Edit New Map - YTyping`,
  description: "",
};
// あとでやる
//ローカルDBに直前の{videoid, mapData}をバックアップ保存する機能
export default async function Home() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <EditProvider>
        <Content />
      </EditProvider>
    </SessionProvider>
  );
}
