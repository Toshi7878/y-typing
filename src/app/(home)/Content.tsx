"use client";
import { Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapList from "./MapList";
import YouTubeContent from "./components/YouTubeContent";
import { useEffect } from "react";
import { handleKeyDown } from "./ts/keydown";
import { useAtom } from "jotai";
import { videoIdAtom } from "./atoms/atoms";

const queryClient = new QueryClient();

export default function Content() {
  const [videoId, setVideoId] = useAtom(videoIdAtom);

  useEffect(() => {
    window.addEventListener("keydown", (event) => handleKeyDown(event, videoId, setVideoId));

    return () => {
      window.removeEventListener("keydown", (event) => handleKeyDown(event, videoId, setVideoId));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <QueryClientProvider client={queryClient}>
      <Box className="grid md:grid-cols-1 lg:grid-cols-2 gap-3">
        <MapList />
      </Box>
      <Box position="fixed" bottom="5" right="5" backgroundColor="black">
        <YouTubeContent />
      </Box>
    </QueryClientProvider>
  );
}
