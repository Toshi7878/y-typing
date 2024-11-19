"use client";
import { Box } from "@chakra-ui/react";
import MapList from "./components/MapList";
import PreviewYouTubeContent from "../../components/PreviewYouTubeContent";
import { useEffect, useState } from "react";
import { handleKeyDown } from "./ts/keydown";
import { Provider } from "jotai";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import React from "react";
import SearchContent from "./components/SearchContent";
import { usePreviewVideoIdAtom, useSetPreviewVideoIdAtom } from "@/components/atom/globalAtoms";

export default function Content() {
  const router = useRouter(); // 追加
  const previewVideoId = usePreviewVideoIdAtom();
  const setPreviewVideoId = useSetPreviewVideoIdAtom();
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
    const keyDownHandler = (event: KeyboardEvent) =>
      handleKeyDown(event, previewVideoId, setPreviewVideoId);
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewVideoId]);

  useEffect(() => {
    return () => {
      setPreviewVideoId(null);
    };
  }, [router]);

  return (
    <Provider>
      <Box className="w-[100%] md:w-[82vw]">
        <SearchContent />
        <MapList />
        <Box position="fixed" bottom={isMobile ? "2" : "5"} right={isMobile ? "2" : "5"}>
          <PreviewYouTubeContent />
        </Box>
      </Box>
    </Provider>
  );
}
