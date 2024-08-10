"use client";
import { Box } from "@chakra-ui/react";
import MapList from "./MapList";
import YouTubeContent from "./components/YouTubeContent";
import { useEffect } from "react";
import { handleKeyDown } from "./ts/keydown";
import { useAtom } from "jotai";
import { videoIdAtom } from "./atoms/atoms";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export default function Content() {
  const [videoId, setVideoId] = useAtom(videoIdAtom);
  const router = useRouter(); // 追加

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

  useEffect(() => {
    NProgress.done();
  }, []);

  const isMobile = window.innerWidth <= 480;

  return (
    <>
      <Box className="grid md:grid-cols-1 lg:grid-cols-2 gap-3 mb-10">
        <MapList />
      </Box>
      <Box
        position="fixed"
        bottom={isMobile ? "2" : "5"}
        right={isMobile ? "2" : "5"}
        backgroundColor="black"
      >
        <YouTubeContent className="" />
      </Box>
    </>
  );
}
