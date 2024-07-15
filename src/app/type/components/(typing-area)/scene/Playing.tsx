import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
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
import { LineResultObj, Status, StatusRef } from "@/app/type/(ts)/type";
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

const Playing = forwardRef((props: PlayingProps, ref) => {
  const { tabStatusRef, lineResultRef } = props;

  const { playerRef, playingRef, statusRef, ytStateRef, setRef } = useRefs();

  const [map] = useAtom(mapAtom);
  const lineProgressRef = useRef(null);
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const [currentTime, setCurrentTime] = useAtom(currentTimeSSMMAtom);

  const [status, setStatus] = useAtom(statusAtom);
  const [lineWord, setLineWord] = useAtom(lineWordAtom);
  const [remainTime, setRemainTime] = useAtom(remainTimeAtom);
  const [lineKpm, setLineKpm] = useAtom(lineKpmAtom);
  const [scene] = useAtom(sceneAtom);
  const [, setNotify] = useAtom(playingNotifyAtom);
  const [speedData, setSpeedData] = useAtom(speedAtom);

  useImperativeHandle(ref, () => ({
    retry: () => {
      const currentPlayingCenterRef = playingCenterRef.current; // 追加

      setStatus(
        structuredClone({
          ...defaultStatus,
          display: {
            ...defaultStatus, // 追加
            line: map!.lineLength,
          },
        }),
      );
      (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
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
      const nextLine = map!.data[statusRef.current!.status.count];
      playerRef.current.seekTo(Number(nextLine.time) - 1 + (1 - speedData.realtimeSpeed));
      skipGuideRef.current?.setSkipGuide?.("");
    },
    realtimeSpeedChange: () => {
      new YTSpeedController("change", { speedData, setSpeedData, playerRef: playerRef.current });
    },
    gamePause: () => {
      if (ytStateRef.current?.isPaused) {
        playerRef.current.playVideo();
        setNotify({ text: "▶" });
      } else {
        playerRef.current.pauseVideo();
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
        const count = statusRef.current!.status.count;

        const result = new Typing({ event, lineWord: cloneLineWord });
        const prevLine = map!.data[count - 1];

        const lineTime = Number(timer.currentTime) - Number(prevLine.time);

        if (lineWord.correct["r"] !== result.newLineWord.correct["r"]) {
          // 変更
          const currentLine = map!.data[count];
          const remainTime = Number(currentLine.time) - Number(timer.currentTime);

          const success = new Success(
            status,
            statusRef,
            result.updatePoint,
            result.newLineWord,
            map!,
            lineTime,
            remainTime,
            event.key,
          );
          setStatus(success.newStatus);
          setLineWord(result.newLineWord);

          setLineKpm(success.lineTypeSpeed);
          if (!result.newLineWord.nextChar["k"]) {
            statusRef.current!.status.totalTypeTime += lineTime;
          }
        } else if (result.newLineWord.correct["r"] !== "") {
          const miss = new Miss(status, statusRef, map!, lineTime, event.key);
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

    const count = statusRef.current!.status.count;

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

    if (Math.abs(Number(timer.currentTime) - remainTime) >= 0.1) {
      const currentPlayingCenterRef = playingCenterRef.current;

      const lineWord = currentPlayingCenterRef!.getLineWord();
      const lineTime = prevLine ? Number(timer.currentTime) - Number(prevLine.time) : 0;
      const newRemainTime = Number(currentLine.time) - Number(timer.currentTime);
      const status = tabStatusRef.current?.getStatus() as unknown as Status;

      setRemainTime(newRemainTime);

      if (lineWord.nextChar["k"]) {
        const typeSpeed = new CalcTypeSpeed(status!, lineTime, statusRef);
        setLineKpm(typeSpeed.lineTypeSpeed);
        setStatus({
          ...status!,
          kpm: typeSpeed.totalTypeSpeed,
        });
      }

      skipGuide(lineWord.nextChar["k"], lineTime, remainTime, skipGuideRef);

      if (Math.abs(Number(timer.currentTime) - currentTime) >= 1) {
        setCurrentTime(Number(timer.currentTime));
      }
    }

    if (nextLine && Number(timer.currentTime) >= Number(currentLine["time"])) {
      const currentPlayingCenterRef = playingCenterRef.current;

      const lineWord = currentPlayingCenterRef!.getLineWord();
      const status = tabStatusRef.current?.getStatus() as Status | undefined;
      const lineTime = prevLine ? Number(timer.currentTime) - Number(prevLine.time) : 0;

      const lineResult = new LineResult(status!, statusRef, lineWord, map, lineTime);

      lineResultRef.current!.push({
        status: {
          point: status!.point,
          timeBonus: status!.timeBonus,
          type: status!.type,
          miss: status!.miss,
          combo: status!.combo,
          clearTime: statusRef.current!.lineStatus.lineClearTime,
          kpm: status!.kpm,
          rkpm: 0,
          lineKpm: lineKpm,
        },
        typeResult: statusRef.current!.lineStatus.typeResult,
      });
      setStatus(lineResult.newStatus);
      if (lineWord.nextChar["k"]) {
        statusRef.current!.status.totalTypeTime = lineResult.newTotalTime;
      }
      statusRef.current!.status.count += 1;

      if (playingCenterRef.current) {
        statusRef.current!.lineStatus = structuredClone(defaultStatusRef.lineStatus);
        setLineKpm(0);

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
    statusRef,
    remainTime,
    tabStatusRef,
    setRemainTime,
    currentTime,
    setLineKpm,
    setStatus,
    setCurrentTime,
    lineResultRef,
    lineKpm,
  ]);

  useEffect(() => {
    timer.addListener(updateLine);
    // クリーンアップ: refのデータをリセット
    const progressElement = lineProgressRef.current as unknown as HTMLProgressElement;
    const currentPlayingCenterRef = playingCenterRef.current; // 追加

    const currentTotalTimeProgress = totalTimeProgressRef.current;
    currentTotalTimeProgress!.max = map?.movieTotalTime ?? 0;
    const currentStatusRef = statusRef.current; // 追加

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

      if (scene !== "end" && scene !== "playing") {
        setStatus(structuredClone(defaultStatus));
        (currentStatusRef as StatusRef) = structuredClone(defaultStatusRef);
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
