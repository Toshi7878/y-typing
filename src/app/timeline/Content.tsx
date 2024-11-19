"use client";
import { Box } from "@chakra-ui/react";
import UsersResultList from "./components/UsersResultList";
import { useEffect, useState } from "react";
import { Provider } from "jotai";
import NProgress from "nprogress";
import React from "react";
import PreviewYouTubeContent from "@/components/PreviewYouTubeContent";

export default function Content() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    handleResize(); // 初期値を設定
    window.getSelection()!.removeAllRanges();
    NProgress.done();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Provider>
      <Box as="main" className="w-[100%] md:w-[90vw] 2xl:w-[65vw]">
        <UsersResultList />
        <Box position="fixed" bottom={isMobile ? "2" : "5"} right={isMobile ? "2" : "5"}>
          <PreviewYouTubeContent />
        </Box>
      </Box>
    </Provider>
  );
}
