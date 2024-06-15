"use client";
import React, { useState, useEffect } from "react";
import TabContent from "./(tab-content)/Tab";
import TableContent from "./(table-content)/TableContent";
import TimeRange from "./TimeRange";
import YouTubeContent from "./(youtube-content)/YoutubeConent";
import { Provider } from "react-redux";
import store from "./(redux)/store";
import InfoTabProvider from "./(contexts)/InfoTabProvider";
import { RefsProvider } from "./(contexts)/refsProvider";
import { useSearchParams } from "next/navigation";

// あとでやる
//ローカルDBに直前の{videoid, mapData}をバックアップ保存する機能
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (typeof window === "undefined" || !isMounted) {
    return null; // クライアントサイドでのみレンダリングする
  }

  return (
    <Provider store={store}>
      <InfoTabProvider>
        <RefsProvider>
          <main className="flex min-h-screen sm:px-0 flex-col items-center pt-14 md:px-14">
            <section className="flex flex-col lg:flex-row w-full ">
              <YouTubeContent
                className="md:mr-5 md:min-w-[384px] md:min-h-[216px]"
                videoId={videoId}
              />
              <TabContent className="w-full border-black" />
            </section>
            <section className="w-full mt-2">
              <TimeRange />
            </section>
            <section className="w-full mt-3">
              <TableContent />
            </section>
          </main>
        </RefsProvider>
      </InfoTabProvider>
    </Provider>
  );
}
