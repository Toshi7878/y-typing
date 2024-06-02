"use client";
import React, { useRef, useState, useEffect } from "react";

import TabContent from "./(tab-content)/TabContent";
import TableContent from "./(table-content)/TableContent";
import TimeRange from "./TimeRange";
import ReactPlayer from "react-player";
import YouTubeContent from "./(youtube-content)/YoutubeConent";
import { Provider } from "react-redux";
import store from "./(redux)/store";
export default function Home() {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // クライアントサイドでのみレンダリングする
  }

  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col items-center p-14">
        <section className="flex flex-col md:flex-row w-full ">
          <YouTubeContent
            className="mr-5"
            playerRef={playerRef}
            playing={playing}
            setPlaying={setPlaying}
          />
          <TabContent className="w-full border-black" />
        </section>
        <section className="w-full mt-2">
          <TimeRange
            className=""
            playerRef={playerRef}
            playing={playing}
            setPlaying={setPlaying}
          />
        </section>
        <section className="w-full mt-3">
          <TableContent
            className="border-black"
            playerRef={playerRef}
            playing={playing}
            setPlaying={setPlaying}
          />
        </section>
      </main>
    </Provider>
  );
}
