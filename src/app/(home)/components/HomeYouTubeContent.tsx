"use client";

import YouTube from "react-youtube";
import { useAtomValue } from "jotai";
import { previewTimeAtom, videoIdAtom } from "../atoms/atoms";

interface HomeYouTubeContentProps {
  className?: string;
}
const HomeYouTubeContent = function YouTubeContent({ className = "" }: HomeYouTubeContentProps) {
  const videoId = useAtomValue(videoIdAtom);
  const previewTime = useAtomValue(previewTimeAtom);

  if (!videoId) {
    return null;
  }

  const onReady = (event: any) => {
    event.target.seekTo(Number(previewTime));
  };

  const WIDTH_DESKTOP = "448px";
  const HEIGHT_DESKTOP = "252px"; // 16:9の比率に調整
  const WIDTH_MOBILE = "256px";
  const HEIGHT_MOBILE = "144px"; // 16:9の比率に調整

  const isMobile = window.innerWidth <= 480;

  return (
    <YouTube
      className={className}
      videoId={videoId}
      opts={{
        width: isMobile ? WIDTH_MOBILE : WIDTH_DESKTOP,
        height: isMobile ? HEIGHT_MOBILE : HEIGHT_DESKTOP,
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

export default HomeYouTubeContent;
