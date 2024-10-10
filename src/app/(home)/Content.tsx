"use client";
import { Box } from "@chakra-ui/react";
import MapList from "./components/MapList";
import HomeYouTubeContent from "./components/HomeYouTubeContent";
import { useEffect, useState } from "react";
import { handleKeyDown } from "./ts/keydown";
import { useAtom } from "jotai";
import { videoIdAtom } from "./atoms/atoms";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import React from "react";

export default function Content() {
  const [videoId, setVideoId] = useAtom(videoIdAtom);
  const router = useRouter(); // 追加

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    handleResize(); // 初期値を設定
    window.getSelection()!.removeAllRanges();
    NProgress.done();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => handleKeyDown(event, videoId, setVideoId);
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    return () => {
      setVideoId(null);
    };
  }, [router, setVideoId]);

  return (
    <>
      <MapList />
      <Box position="fixed" bottom={isMobile ? "2" : "5"} right={isMobile ? "2" : "5"}>
        <HomeYouTubeContent />
      </Box>
    </>
  );
}
