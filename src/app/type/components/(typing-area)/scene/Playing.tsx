import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { useEffect, useRef } from "react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  currentTimeSSMMAtom,
  lineWordAtom,
  mapAtom,
  statusAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { timer } from "@/app/type/(ts)/timer";
import { ticker, updateFunction } from "../../(youtube-content)/youtubeEvents";
import PlayingBottom from "./child/PlayingBottom";
import { skipGuide, SkipGuideRef } from "./child/child/PlayingSkipGuide";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";

const Playing = () => {
  const { lineCountRef, playerRef } = useRefs();
  const [map] = useAtom(mapAtom);
  const progressRef = useRef(null);
  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const [, setCurrentTimeSSMM] = useAtom(currentTimeSSMMAtom);
  const currentTimeRef = useRef(0);
  const remainTimeRef = useRef(0);
  const [status, setStatus] = useAtom(statusAtom);
  const [lineWord, setLineWord] = useAtom(lineWordAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTyped({ event, lineWord })) {
        const result = new Typing({ event, lineWord });

        if (result.newLineWord) {
          // 変更
          setStatus(new Success(status, result.updatePoint, result.newLineWord).newStatus);
          setLineWord(result.newLineWord);
        } else {
          setStatus(new Miss(status).newStatus);
        }
      } else {
        shortcutKey(event, skipGuideRef, map!, lineCountRef.current, 1, playerRef);
      }

      const IS_COPY = event.ctrlKey && event.code == "KeyC";
      if (!IS_COPY) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWord, status]);

  useEffect(() => {
    const updateLine = () => {
      if (!map) {
        return;
      }

      const count = lineCountRef.current;

      const prevLine = map.data[count - 1];
      const currentLine = map.data[count];
      const nextLine = map.data[count + 1];

      if (Math.abs(Number(timer.currentTime) - remainTimeRef.current) >= 0.1) {
        //ライン経過時間 ＆ 打鍵速度計算

        // if (!lineResult.value.completed) {
        //   this.lineTime = this.currentTime - nextLine.time / speed.value;

        //   const IS_WORD = typeArea.value.nextChar["k"];
        //   if (IS_WORD) {
        //     this.updateTypeSpeed();
        //   }
        // }
        remainTimeRef.current = Number(timer.currentTime);
        const currentPlayingCenterRef = playingCenterRef.current; // 追加

        const kana = currentPlayingCenterRef!.getLineWord();
        const lineTime = Number(timer.currentTime) - Number(prevLine.time);
        const remainTime = Number(currentLine.time) - Number(timer.currentTime);
        console.log(remainTime);

        skipGuide(kana.nextChar["k"], lineTime, remainTime, skipGuideRef);

        if (Math.abs(Number(timer.currentTime) - currentTimeRef.current) >= 1) {
          //曲の経過時間を[分:秒]で表示}
          setCurrentTimeSSMM(Number(timer.currentTime));
          currentTimeRef.current = Number(timer.currentTime);
        }
      }

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
    const progressElement = progressRef.current as unknown as HTMLProgressElement;
    const currentPlayingCenterRef = playingCenterRef.current; // 追加

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
      <PlayingBottom skipGuideRef={skipGuideRef} />
    </Box>
  );
};
export default Playing;
