"use client";
import { Box } from "@chakra-ui/react";
import UsersResultList from "./components/UsersResultList";
import HomeYouTubeContent from "./components/HomeYouTubeContent";
import { useEffect } from "react";
import { handleKeyDown } from "./ts/keydown";
import { useAtom } from "jotai";
import { videoIdAtom } from "./atoms/atoms";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import React from "react";

export default function Content() {
  const [videoId, setVideoId] = useAtom(videoIdAtom);
  const router = useRouter(); // 追加

  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    NProgress.done();
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
      <UsersResultList />
      <Box position="fixed">
        <HomeYouTubeContent />
      </Box>
    </>
  );
}
