import { Box, Card } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { timer } from "../(youtube-content)/timer";
import { Line } from "@/types";
import Lyrics from "./child/Lyrics";
import LineProgress from "./child/LineProgress";
import { ticker, updateFunction, ytState } from "../(youtube-content)/youtubeEvents";

interface TypingAreaProps {
  mapData: Line[];
}

function TypingArea({ mapData }: TypingAreaProps) {
  const lineCountRef = useRef(0);
  const progressRef = useRef<HTMLProgressElement>(null);
  const [lyrics, setLyrics] = useState(mapData[0]["lyrics"]);
  const [nextLyrics, setNextLyrics] = useState(mapData[0]["lyrics"]);
  useEffect(() => {
    const updateLine = () => {
      const prevLine = mapData[lineCountRef.current - 1];
      const currentLine = mapData[lineCountRef.current];
      const nextLine = mapData[lineCountRef.current + 1];

      if (nextLine && Number(timer.currentTime) >= Number(currentLine["time"])) {
        lineCountRef.current += 1;
        setLyrics(currentLine["lyrics"]);
        setNextLyrics(nextLine["lyrics"]);
        if (progressRef.current) {
          progressRef.current.max = Number(nextLine["time"]) - Number(currentLine["time"]);
        }
      }

      if (progressRef.current) {
        if (prevLine) {
          progressRef.current!.value = Number(timer.currentTime) - Number(prevLine["time"]);
        } else {
          progressRef.current!.value = Number(timer.currentTime);
        }
      }
    };

    timer.addListener(updateLine);
    return () => {
      timer.removeListener(updateLine);
      ticker.stop();
      ticker.remove(updateFunction);
      // クリーンアップ: refのデータをリセット
      const progressElement = progressRef.current;

      lineCountRef.current = 0;

      if (progressElement) {
        progressRef.current.value = 0;

        progressRef.current.max = 0; // maxのリセット
      }

      setLyrics(""); // lyricsのリセット
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapData]);

  return (
    <Box w="full" mt="8" h="calc(100vh - 400px)">
      <Card variant={"outline"} h="full" borderColor="black">
        <LineProgress ref={progressRef} />
        <Box p="4" className="text-xl" display="inline">
          <Lyrics lyrics={lyrics} />
          <Lyrics className={" text-gray-400 text-xs"} lyrics={nextLyrics} />
        </Box>
      </Card>
    </Box>
  );
}

export default TypingArea;
