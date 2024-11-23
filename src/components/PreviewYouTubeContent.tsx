"use client";

import YouTube from "react-youtube";
import {
  usePreviewTimeAtom,
  usePreviewVideoIdAtom,
  useSetPreviewVideoIdAtom,
  useVolumeAtom,
} from "./atom/globalAtoms";
import { useEffect } from "react";
import { useGlobalRefs } from "./globalRefContext/GlobalRefProvider";
import { usePreviewYouTubeKeyDown } from "@/lib/hooks/usePreviewYouTubeKeyDown";
import { useRouter } from "next/navigation";

interface PreviewYouTubeContentProps {
  className?: string;
}
const PreviewYouTubeContent = function YouTubeContent({
  className = "",
}: PreviewYouTubeContentProps) {
  const router = useRouter(); // 追加

  const videoId = usePreviewVideoIdAtom();
  const previewTime = usePreviewTimeAtom();
  const volume = useVolumeAtom();
  const { setRef } = useGlobalRefs();
  const setPreviewVideoId = useSetPreviewVideoIdAtom();
  const previewYouTubeKeyDown = usePreviewYouTubeKeyDown();

  useEffect(() => {
    window.addEventListener("keydown", previewYouTubeKeyDown);

    return () => {
      window.removeEventListener("keydown", previewYouTubeKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    return () => {
      setPreviewVideoId(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!videoId) {
    return null;
  }

  const onReady = (event: any) => {
    event.target.setVolume(volume);
    event.target.seekTo(previewTime);
    event.target.playVideo();
    setRef("playerRef", event.target);
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
          start: Number(previewTime),
          playsinline: 1,
          autoplay: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
      }}
      onReady={onReady}
    />
  );
};

export default PreviewYouTubeContent;
