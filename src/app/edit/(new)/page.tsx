import { Metadata } from "next";
import { auth } from "@/lib/auth";
import EditProvider from "../components/EditProvider";
import Content from "../components/Content";

export const metadata: Metadata = {
  title: `Edit New Map - YTyping`,
  description: "",
};
// あとでやる
//ローカルDBに直前の{videoid, mapData}をバックアップ保存する機能
export default async function Home() {
  return (
    <EditProvider>
      <Content />
    </EditProvider>
  );
}
