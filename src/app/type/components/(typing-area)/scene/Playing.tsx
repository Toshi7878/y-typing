import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { useEffect, useRef } from "react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { timer } from "@/app/type/(ts)/timer";
import { ticker, updateFunction } from "../../(youtube-content)/youtubeEvents";
import PlayingBottom from "./child/PlayingBottom";

const Playing = () => {
  const { lineCountRef } = useRefs();
  const [map] = useAtom(mapAtom);
  const progressRef = useRef(null);
  const playingCenterRef = useRef<PlayingCenterRef>(null);

  useEffect(() => {
    const updateLine = () => {
      if (!map) {
        return;
      }

      const count = lineCountRef.current;

      const prevLine = map.data[count - 1];
      const currentLine = map.data[count];
      const nextLine = map.data[count + 1];

      if (nextLine && Number(timer.currentTime) >= Number(currentLine["time"])) {
        lineCountRef.current += 1;

        if (playingCenterRef.current) {
          playingCenterRef.current.setLineWord({
            correct: { k: "", r: "" },
            nextChar: [...map.typePattern[count]][0],
            word: [...map.typePattern[count]].slice(1),
          });

          playingCenterRef.current.setLyrics(currentLine["lyrics"]);
          playingCenterRef.current.setNextLyrics({
            lyrics: nextLine["lyrics"],
            kpm: (map.romaLineSpeedList[count + 1] * 60).toFixed(0),
          });
        }

        if (progressRef.current) {
          const progressElement = progressRef.current as HTMLProgressElement;

          progressElement.max = Number(nextLine["time"]) - Number(currentLine["time"]);
        }
      }

      if (progressRef.current) {
        const progressElement = progressRef.current as HTMLProgressElement;
        if (prevLine) {
          progressElement.value = Number(timer.currentTime) - Number(prevLine["time"]);
        } else {
          progressElement.value = Number(timer.currentTime);
        }
      }
    };

    timer.addListener(updateLine);
    // クリーンアップ: refのデータをリセット
    const currentPlayingCenterRef = playingCenterRef.current; // 追加
    const progressElement = progressRef.current as unknown as HTMLProgressElement;

    return () => {
      timer.removeListener(updateLine);
      ticker.stop();
      ticker.remove(updateFunction);

      if (currentPlayingCenterRef) {
        currentPlayingCenterRef.setLineWord({
          correct: { k: "", r: "" },
          nextChar: { k: "", r: [""], p: 0 },
          word: [{ k: "", r: [""], p: 0 }],
        });

        currentPlayingCenterRef.setLyrics("");
        currentPlayingCenterRef.setNextLyrics({ lyrics: "", kpm: "" });
      }

      lineCountRef.current = 0;

      if (progressElement) {
        progressElement.value = 0;
        progressElement.max = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <PlayingTop progressRef={progressRef} />
      <PlayingCenter ref={playingCenterRef} flex="1" />
      <PlayingBottom />
    </Box>
  );
};
export default Playing;
