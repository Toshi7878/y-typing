"use client";

import YouTube from "react-youtube";
import { useAtom } from "jotai";
import { previewTimeAtom, videoIdAtom } from "../atoms/atoms";

const YouTubeContent = function YouTubeContent() {
  const [videoId] = useAtom(videoIdAtom);
  const [previewTime] = useAtom(previewTimeAtom);

  if (!videoId) {
    return null;
  }

  const onReady = (event: any) => {
    console.log("ready");
    event.target.seekTo(Number(previewTime));
  };

  const WIDTH = "448px";
  const HEIGHT = `252px`; // 16:9の比率に調整

  return (
    <YouTube
      videoId={videoId}
      opts={{
        width: WIDTH,
        height: HEIGHT,
        playerVars: {
          enablejsapi: 1,
          start: Number(previewTime), // 再生時間を指定

          autoplay: 1,
        },
      }}
      onReady={onReady}
      // onStateChange={onStateChange}
    />
  );
};

export default YouTubeContent;
