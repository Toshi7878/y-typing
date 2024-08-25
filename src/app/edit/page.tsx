"use client";
import React from "react";
import InfoTabProvider from "./edit-contexts/InfoTabProvider";
import { RefsProvider } from "./edit-contexts/refsProvider";
import { useSearchParams } from "next/navigation";
import Content from "./content";

// あとでやる
//ローカルDBに直前の{videoid, mapData}をバックアップ保存する機能
export default function Home() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || "";

  return (
    <InfoTabProvider>
      <RefsProvider>
        <Content mapInfo={{ videoId }} />
      </RefsProvider>
    </InfoTabProvider>
  );
}
