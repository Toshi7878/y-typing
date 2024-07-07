import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { useCallback, useEffect, useRef } from "react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  currentTimeSSMMAtom,
  defaultStatus,
  lineKpmAtom,
  lineWordAtom,
  mapAtom,
  remainTimeAtom,
  sceneAtom,
  statusAtom,
  timeBonusAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { timer } from "@/app/type/(ts)/timer";
import { ticker, updateFunction } from "../../(youtube-content)/youtubeEvents";
import PlayingBottom from "./child/PlayingBottom";
import { skipGuide, SkipGuideRef } from "./child/child/PlayingSkipGuide";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";
import { LineResult } from "@/app/type/(ts)/lineResult";
import { TabStatusRef } from "../../(tab)/tab/TabStatus";
import { CalcTypeSpeed } from "@/app/type/(ts)/calcTypeSpeed";
import { Status } from "@/app/type/(atoms)/type";

export interface LineStatus {
  type: number;
  miss: number;
}
interface PlayingProps {
  tabStatusRef: React.RefObject<TabStatusRef>;
}

const defaultLineStatus = {
  type: 0,
  miss: 0,
};

const Playing = ({ tabStatusRef }: PlayingProps) => {
  const { lineCountRef, playerRef } = useRefs();
  const lineStatusRef = useRef(structuredClone(defaultLineStatus));

  const [map] = useAtom(mapAtom);
  const [, setTimeBonus] = useAtom(timeBonusAtom);
  const progressRef = useRef(null);
  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const [, setCurrentTimeSSMM] = useAtom(currentTimeSSMMAtom);
  const currentTimeRef = useRef(0);
  const remainTimeRef = useRef(0);
  const totalTypeTimeRef = useRef(0);
  const [status, setStatus] = useAtom(statusAtom);
  const [lineWord, setLineWord] = useAtom(lineWordAtom);
  const [, setRemainTime] = useAtom(remainTimeAtom);
  const [, setLineKpm] = useAtom(lineKpmAtom);
  const [scene] = useAtom(sceneAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const cloneLineWord = structuredClone(lineWord);
      if (isTyped({ event, lineWord: cloneLineWord })) {
        const result = new Typing({ event, lineWord: cloneLineWord });

        if (lineWord.correct["r"] !== result.newLineWord.correct["r"]) {
          // 変更
          const count = lineCountRef.current;
          const prevLine = map!.data[count - 1];
          const currentLine = map!.data[count];

          const lineTime = Number(timer.currentTime) - Number(prevLine.time);
          const remainTime = Number(currentLine.time) - Number(timer.currentTime);

          const success = new Success(
            status,
            lineStatusRef,
            setTimeBonus,
            result.updatePoint,
            result.newLineWord,
            map!,
            lineTime,
            totalTypeTimeRef.current,
            remainTime,
          );
          setStatus(success.newStatus);
          setLineWord(result.newLineWord);

          setLineKpm(success.lineTypeSpeed);
          if (!result.newLineWord.nextChar["k"]) {
            totalTypeTimeRef.current += lineTime;
          }
        } else if (result.newLineWord.correct["r"] !== "") {
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

  const updateLine = useCallback(() => {
    if (!map) {
      return;
    }

    const count = lineCountRef.current;

    const prevLine = map.data[count - 1];
    const currentLine = map.data[count];
    const nextLine = map.data[count + 1];

    if (Math.abs(Number(timer.currentTime) - remainTimeRef.current) >= 0.1) {
      remainTimeRef.current = Number(timer.currentTime);
      const currentPlayingCenterRef = playingCenterRef.current;

      const lineWord = currentPlayingCenterRef!.getLineWord();
      const lineTime = Number(timer.currentTime) - Number(prevLine.time);
      const remainTime = Number(currentLine.time) - Number(timer.currentTime);
      const status = tabStatusRef.current?.getStatus() as unknown as Status;

      setRemainTime(remainTime.toFixed(1));
      if (lineWord.nextChar["k"]) {
        const typeSpeed = new CalcTypeSpeed(
          status!,
          lineStatusRef.current!,
          lineTime,
          totalTypeTimeRef.current,
        );
        setLineKpm(typeSpeed.lineTypeSpeed);

        setStatus({ ...status!, kpm: typeSpeed.totalTypeSpeed });
      }
      skipGuide(lineWord.nextChar["k"], lineTime, remainTime, skipGuideRef);

      if (Math.abs(Number(timer.currentTime) - currentTimeRef.current) >= 1) {
        setCurrentTimeSSMM(Number(timer.currentTime));
        currentTimeRef.current = Number(timer.currentTime);
      }
    }

    if (nextLine && Number(timer.currentTime) >= Number(currentLine["time"])) {
      const currentPlayingCenterRef = playingCenterRef.current;

      const lineWord = currentPlayingCenterRef!.getLineWord();
      const status = tabStatusRef.current?.getStatus();
      const lineTime = prevLine ? Number(timer.currentTime) - Number(prevLine.time) : 0;

      const lineResult = new LineResult(status!, lineWord, map, lineTime, totalTypeTimeRef);
      setStatus(lineResult.newStatus);

      lineCountRef.current += 1;

      if (playingCenterRef.current) {
        lineStatusRef.current = structuredClone(defaultLineStatus);
        setLineKpm(0);
        setTimeBonus(0);

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
  }, [
    map,
    lineCountRef,
    playingCenterRef,
    tabStatusRef,
    skipGuideRef,
    setRemainTime,
    setLineKpm,
    setStatus,
    setTimeBonus,
    setCurrentTimeSSMM,
    lineStatusRef,
    totalTypeTimeRef,
    currentTimeRef,
    remainTimeRef,
    progressRef,
  ]);

  useEffect(() => {
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
      if (scene !== "end" && scene !== "playing") {
        setStatus(defaultStatus);
      }

      if (progressElement) {
        progressElement.value = 0;
        progressElement.max = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box height="100vh" display="flex" flexDirection="column" className="select-none">
      <PlayingTop progressRef={progressRef} />
      <PlayingCenter ref={playingCenterRef} flex="1" />
      <PlayingBottom skipGuideRef={skipGuideRef} />
    </Box>
  );
};
export default Playing;
