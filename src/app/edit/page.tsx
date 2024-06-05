"use client";
import React, { useState, useEffect } from "react";
import TabContent from "./(tab-content)/TabContent";
import TableContent from "./(table-content)/TableContent";
import TimeRange from "./TimeRange";
import YouTubeContent from "./(youtube-content)/YoutubeConent";
import { Provider } from "react-redux";
import store from "./(redux)/store";
import { PlayerProvider } from "./(youtube-content)/playerProvider";
import InputProvider from "./InputProvider";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // クライアントサイドでのみレンダリングする
  }

  return (
    <Provider store={store}>
      <PlayerProvider>
        <InputProvider>
          <main className="flex min-h-screen flex-col items-center p-14">
            <section className="flex flex-col md:flex-row w-full ">
              <YouTubeContent className="mr-5" />
              <TabContent className="w-full border-black" />
            </section>
            <section className="w-full mt-2">
              <TimeRange />
            </section>
            <section className="w-full mt-3">
              <TableContent />
            </section>
          </main>
        </InputProvider>
      </PlayerProvider>
    </Provider>
  );
}