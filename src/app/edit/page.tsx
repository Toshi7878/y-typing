"use client";
import { useSearchParams } from "next/navigation";
import Content from "./components/Content";
import EditProvider from "./components/EditProvider";

// あとでやる
//ローカルDBに直前の{videoid, mapData}をバックアップ保存する機能
export default function Home() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || "";

  return (
    <EditProvider>
      <Content mapInfo={{ videoId }} />
    </EditProvider>
  );
}
