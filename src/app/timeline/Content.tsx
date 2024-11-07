"use client";
import { Box } from "@chakra-ui/react";
import UsersResultList from "./components/UsersResultList";
import HomeYouTubeContent from "./components/HomeYouTubeContent";
import { useEffect, useState } from "react";
import { handleKeyDown } from "./ts/keydown";
import { useAtom } from "jotai";
import { videoIdAtom } from "./atoms/atoms";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import React from "react";
import SearchContent from "./components/search/SearchContent";

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
    <Box as="main" className="w-[100%] md:w-[90vw] 2xl:w-[65vw]">
      <SearchContent />
      <UsersResultList />
      <Box position="fixed" bottom={isMobile ? "2" : "5"} right={isMobile ? "2" : "5"}>
        <HomeYouTubeContent />
      </Box>
    </Box>
  );
}
