"use client";
import { Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapList from "./MapList";
import YouTubeContent from "./components/YouTubeContent";
import { useEffect } from "react";
import { handleKeyDown } from "./ts/keydown";
import { useAtom } from "jotai";
import { videoIdAtom } from "./atoms/atoms";
import { usePathname, useRouter } from "next/navigation";

const queryClient = new QueryClient();

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

  const isMobile = window.innerWidth <= 480;

  return (
    <QueryClientProvider client={queryClient}>
      <Box className="grid md:grid-cols-1 lg:grid-cols-2 gap-3">
        <MapList />
      </Box>
      <Box
        position="fixed"
        bottom={isMobile ? "2" : "5"}
        right={isMobile ? "2" : "5"}
        backgroundColor="black"
      >
        <YouTubeContent />
      </Box>
    </QueryClientProvider>
  );
}
