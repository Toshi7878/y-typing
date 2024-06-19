import { Box, Card, Heading } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import { timer } from "../(youtube-content)/timer";
import { Line } from "@/types";
import Lyrics from "./child/Lyrics";
import LineProgress from "./child/LineProgress";
import { useAtom } from "jotai";
import { lyricsAtom } from "../../(atoms)/gameRenderAtoms";
import { LyricsHandle } from "./child/Lyrics";

interface TypingAreaProps {
  mapData: Line[];
}

function TypingArea({ mapData }: TypingAreaProps) {
  const lineCountRef = useRef(0);
  const progressRef = useRef<HTMLProgressElement>(null);
  const lyricsRef = useRef<LyricsHandle>(null);
  useEffect(() => {
    const updateLine = () => {
      const prevLine = mapData[lineCountRef.current - 1];
      const currentLine = mapData[lineCountRef.current];
      const nextLine = mapData[lineCountRef.current + 1];

      if (nextLine && Number(timer.currentTime) >= Number(currentLine["time"])) {
        lineCountRef.current += 1;
        lyricsRef.current!.setLyrics(currentLine["lyrics"]);
        if (progressRef.current) {
          progressRef.current.max = Number(nextLine["time"]) - Number(currentLine["time"]);
        }
      }

      if (prevLine) {
        progressRef.current!.value = Number(timer.currentTime) - Number(prevLine["time"]);
      } else {
        progressRef.current!.value = Number(timer.currentTime);
      }
    };

    timer.addListener(updateLine);
    return () => {
      timer.removeListener(updateLine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box w="full" mt="8" h="calc(100vh - 400px)">
      <Card variant={"outline"} h="full" borderColor="black">
        <LineProgress ref={progressRef} />
        <Box p="4" className="text-xl" display="inline">
          <Lyrics ref={lyricsRef} />
        </Box>
      </Card>
    </Box>
  );
}

export default TypingArea;
