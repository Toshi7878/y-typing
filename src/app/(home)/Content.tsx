"use client";
import { Box } from "@chakra-ui/react";
import MapList from "./components/MapList";
import PreviewYouTubeContent from "../../components/PreviewYouTubeContent";
import { useEffect, useState } from "react";
import { Provider } from "jotai";
import NProgress from "nprogress";
import React from "react";
import SearchContent from "./components/SearchContent";

export default function Content() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    handleResize(); // 初期値を設定
    window.getSelection()!.removeAllRanges();
    NProgress.done();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Provider>
      <Box
        as="main"
        minH="100vh"
        width={"100%"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        pt={16}
      >
        <Box width={{ base: "100%", lg: "92vw", "2xl": "82vw" }}>
          <SearchContent />
          <MapList />
          <Box position="fixed" bottom={isMobile ? "2" : "5"} right={isMobile ? "2" : "5"}>
            <PreviewYouTubeContent />
          </Box>
        </Box>
      </Box>
    </Provider>
  );
}
