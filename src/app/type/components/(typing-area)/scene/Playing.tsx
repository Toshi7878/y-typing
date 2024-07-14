import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  currentTimeSSMMAtom,
  defaultStatus,
  lineKpmAtom,
  lineWordAtom,
  mapAtom,
  playingNotifyAtom,
  remainTimeAtom,
  sceneAtom,
  speedAtom,
  statusAtom,
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
import { LineResultObj, LineStatus, Status, TypeResult } from "@/app/type/(ts)/type";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";

export const defaultLineResultObj: LineResultObj = {
  status: {
    point: 0,
    timeBonus: 0,
    type: 0,
    miss: 0,
    combo: 0,
    clearTime: 0,
    kpm: 0,
    rkpm: 0,
    lineKpm: 0,
  },
  typeResult: [],
};

interface PlayingProps {
  tabStatusRef: React.RefObject<TabStatusRef>;
  lineResultRef: React.RefObject<LineResultObj[]>;
}

export const defaultLineStatus = {
  type: 0,
  miss: 0,
};

const Playing = forwardRef((props: PlayingProps, ref) => {
  const { tabStatusRef, lineResultRef } = props;

  const { lineCountRef, playerRef, playingRef, setRef } = useRefs();

  const lineStatusRef = useRef(structuredClone(defaultLineStatus));

  const [map] = useAtom(mapAtom);
  const lineProgressRef = useRef(null);
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const lineTypeResult = useRef<TypeResult[]>([]);
  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const [, setCurrentTimeSSMM] = useAtom(currentTimeSSMMAtom);
  const currentTimeRef = useRef(0);
  const remainTimeRef = useRef(0);
  const totalTypeTimeRef = useRef(0);
  const clearTimeRef = useRef(0);
  const [status, setStatus] = useAtom(statusAtom);
  const [lineWord, setLineWord] = useAtom(lineWordAtom);
  const [, setRemainTime] = useAtom(remainTimeAtom);
  const [lineKpm, setLineKpm] = useAtom(lineKpmAtom);
  const [scene] = useAtom(sceneAtom);
  const isPausedRef = useRef(false);
  const [, setNotify] = useAtom(playingNotifyAtom);
  const [speedData, setSpeedData] = useAtom(speedAtom);

  useImperativeHandle(ref, () => ({
    retry: () => {
      const currentPlayingCenterRef = playingCenterRef.current; // 追加
      setStatus(
        structuredClone({
          ...defaultStatus,
          display: {
            ...defaultStatus.display, // 追加
            line: map!.lineLength,
          },
        }),
      );
      (lineStatusRef.current as LineStatus) = structuredClone(defaultLineStatus);

      (totalTypeTimeRef.current as number) = 0;
      if (currentPlayingCenterRef) {
        currentPlayingCenterRef.setLineWord({
          correct: { k: "", r: "" },
          nextChar: { k: "", r: [""], p: 0 },
          word: [{ k: "", r: [""], p: 0 }],
        });

        currentPlayingCenterRef.setLyrics("");
        currentPlayingCenterRef.setNextLyrics({ lyrics: "", kpm: "" });
      }

      setNotify({ text: "Retry" });
      playerRef.current.seekTo(0);
    },
    pressSkip: () => {
      const nextLine = map!.data[lineCountRef.current!];
      playerRef.current.seekTo(Number(nextLine.time) - 1 + (1 - speedData.realtimeSpeed));
      skipGuideRef.current?.setSkipGuide?.("");
    },
    realtimeSpeedChange: () => {
      new YTSpeedController("change", { speedData, setSpeedData, playerRef: playerRef.current });
    },
    gamePause: () => {
      if (isPausedRef.current) {
        playerRef.current.playVideo();
        isPausedRef.current = false;
        setNotify({ text: "▶" });
      } else {
        playerRef.current.pauseVideo();
        isPausedRef.current = true;
        setNotify({ text: "ll" });
      }
    },
  }));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("playingRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const cloneLineWord = structuredClone(lineWord);
      if (!isPausedRef.current && isTyped({ event, lineWord: cloneLineWord })) {
        const count = lineCountRef.current;

        const result = new Typing({ event, lineWord: cloneLineWord });
        const prevLine = map!.data[count - 1];

        const lineTime = Number(timer.currentTime) - Number(prevLine.time);

        if (lineWord.correct["r"] !== result.newLineWord.correct["r"]) {
          // 変更
          const currentLine = map!.data[count];
          const remainTime = Number(currentLine.time) - Number(timer.currentTime);

          const success = new Success(
            status,
            lineStatusRef,
            result.updatePoint,
            result.newLineWord,
            map!,
            lineTime,
            totalTypeTimeRef.current,
            remainTime,
            event.key,
            lineTypeResult,
            clearTimeRef,
          );
          setStatus(success.newStatus);
          setLineWord(result.newLineWord);

          setLineKpm(success.lineTypeSpeed);
          if (!result.newLineWord.nextChar["k"]) {
            totalTypeTimeRef.current += lineTime;
          }
        } else if (result.newLineWord.correct["r"] !== "") {
          const miss = new Miss(status, map!, lineTime, event.key, lineTypeResult);
          setStatus(miss.newStatus);
        }
      } else {
        shortcutKey(event, skipGuideRef, playingRef);
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

    const currentTotalTimeProgress = totalTimeProgressRef.current;
    // 倍速実装時timer.constantTimeで計算

    if (
      currentTotalTimeProgress &&
      Math.abs(Number(timer.currentTime) - currentTotalTimeProgress.value) >=
        map.currentTimeBarFrequency
    ) {
      //ライン経過時間 ＆ 打鍵速度計算
      currentTotalTimeProgress.value = Number(timer.currentTime);
    }

    if (Math.abs(Number(timer.currentTime) - remainTimeRef.current) >= 0.1) {
      remainTimeRef.current = Number(timer.currentTime);
      const currentPlayingCenterRef = playingCenterRef.current;

      const lineWord = currentPlayingCenterRef!.getLineWord();
      const lineTime = prevLine ? Number(timer.currentTime) - Number(prevLine.time) : 0;
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

        setStatus({
          ...status!,
          display: {
            ...status.display, // 追加
            kpm: typeSpeed.totalTypeSpeed,
          },
        });
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
      const status = tabStatusRef.current?.getStatus() as Status | undefined;
      const lineTime = prevLine ? Number(timer.currentTime) - Number(prevLine.time) : 0;

      const lineResult = new LineResult(status!, lineWord, map, lineTime, totalTypeTimeRef, count);
      lineResultRef.current!.push({
        status: {
          point: status!.display.point,
          timeBonus: status!.display.timeBonus,
          type: status!.display.type,
          miss: status!.display.miss,
          combo: status!.display.combo,
          clearTime: clearTimeRef.current,
          kpm: status!.display.kpm,
          rkpm: 0,
          lineKpm: lineKpm,
        },
        typeResult: lineTypeResult.current,
      });
      setStatus(lineResult.newStatus);
      if (lineWord.nextChar["k"]) {
        totalTypeTimeRef.current = lineResult.newTotalTime;
      }
      lineCountRef.current += 1;

      if (playingCenterRef.current) {
        lineStatusRef.current = structuredClone(defaultLineStatus);
        setLineKpm(0);
        clearTimeRef.current = 0;
        lineTypeResult.current = [];

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

      if (lineProgressRef.current) {
        const progressElement = lineProgressRef.current as HTMLProgressElement;

        progressElement.max = Number(nextLine["time"]) - Number(currentLine["time"]);
      }
    }

    if (lineProgressRef.current) {
      const progressElement = lineProgressRef.current as HTMLProgressElement;
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
    lineKpm,
    setLineKpm,
    setStatus,
    setCurrentTimeSSMM,
    lineStatusRef,
    totalTypeTimeRef,
    currentTimeRef,
    remainTimeRef,
    lineProgressRef,
    lineResultRef,
  ]);

  useEffect(() => {
    timer.addListener(updateLine);
    // クリーンアップ: refのデータをリセット
    const progressElement = lineProgressRef.current as unknown as HTMLProgressElement;
    const currentPlayingCenterRef = playingCenterRef.current; // 追加

    const currentTotalTimeProgress = totalTimeProgressRef.current;
    currentTotalTimeProgress!.max = map?.movieTotalTime ?? 0;

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
        setStatus(structuredClone(defaultStatus));
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
      <PlayingTop lineProgressRef={lineProgressRef} />
      <PlayingCenter ref={playingCenterRef} flex="1" />
      <PlayingBottom skipGuideRef={skipGuideRef} totalTimeProgressRef={totalTimeProgressRef} />
    </Box>
  );
});

Playing.displayName = "Playing";

export default Playing;
