import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, {
  defaultLineWord,
  defaultNextLyrics,
  PlayingCenterRef,
} from "./child/PlayingCenter";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  mapAtom,
  playingNotifyAtom,
  sceneAtom,
  speedAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { timer } from "@/app/type/(ts)/timer";
import { ticker, updateFunction } from "../../(youtube-content)/youtubeEvents";
import PlayingBottom from "./child/PlayingBottom";
import { SkipGuideRef } from "./child/child/PlayingSkipGuide";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";
import { LineResult } from "@/app/type/(ts)/lineResult";
import { CalcTypeSpeed } from "@/app/type/(ts)/calcTypeSpeed";
import { LineResultObj, StatusRef } from "@/app/type/(ts)/type";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./child/child/PlayingTotalTime";
import { defaultStatus } from "../../(tab)/tab/TabStatus";

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

const Playing = forwardRef((props, ref) => {
  const { playerRef, playingComboRef, tabStatusRef, playingRef, statusRef, ytStateRef, setRef } =
    useRefs();

  const [map] = useAtom(mapAtom);
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingLineTimeRef = useRef<PlayingLineTimeRef>(null);
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingTotalTimeRef = useRef<PlayingTotalTimeRef>(null);
  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const [scene] = useAtom(sceneAtom);
  const [, setNotify] = useAtom(playingNotifyAtom);
  const [speedData, setSpeedData] = useAtom(speedAtom);

  useImperativeHandle(ref, () => ({
    retry: () => {
      const currentPlayingCenterRef = playingCenterRef.current; // 追加

      tabStatusRef.current!.setStatus(
        structuredClone({
          ...defaultStatus,
          display: {
            ...defaultStatus, // 追加
            line: map!.lineLength,
          },
        }),
      );

      (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
      currentPlayingCenterRef!.setLineWord(structuredClone(defaultLineWord));
      currentPlayingCenterRef!.setLyrics("");
      currentPlayingCenterRef!.setNextLyrics(structuredClone(defaultNextLyrics));

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
      const lineWord = playingCenterRef.current!.getLineWord();

      const cloneLineWord = structuredClone(lineWord);
      if (!ytStateRef.current?.isPaused && isTyped({ event, lineWord: cloneLineWord })) {
        const count = statusRef.current!.status.count;
        const result = new Typing({ event, lineWord: cloneLineWord });
        const prevLine = map!.data[count - 1];
        const lineTime = Number(ytStateRef.current!.currentTime) - Number(prevLine.time);
        const status = tabStatusRef.current!.getStatus();

        if (lineWord.correct["r"] !== result.newLineWord.correct["r"]) {
          const currentLine = map!.data[count];
          const remainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;

          const success = new Success(
            status,
            statusRef,
            playingComboRef,
            result.updatePoint,
            result.newLineWord,
            map!,
            lineTime,
            remainTime,
            event.key,
          );

          tabStatusRef.current!.setStatus(success.newStatus);
          playingCenterRef.current!.setLineWord(result.newLineWord);
          playingLineTimeRef.current?.setLineKpm(success.lineTypeSpeed);
          if (!result.newLineWord.nextChar["k"]) {
            statusRef.current!.status.totalTypeTime += lineTime;
          }
        } else if (result.newLineWord.correct["r"] !== "") {
          const miss = new Miss(status, statusRef, playingComboRef, lineTime, event.key);
          tabStatusRef.current!.setStatus(miss.newStatus);
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
  }, []);

  const updateLine = useCallback(
    (ytCurrentTime: number) => {
      if (!map) {
        return;
      }
      ytStateRef.current!.currentTime = ytCurrentTime;

      const count = statusRef.current!.status.count;
      const prevLine = map.data[count - 1];
      const currentLine = map.data[count];
      const nextLine = map.data[count + 1];
      let lineTime: number;
      const remainTime = Number(currentLine.time) - Number(ytCurrentTime);
      const currentTotalTimeProgress = totalTimeProgressRef.current;
      const currentLineProgress = lineProgressRef.current;

      if (prevLine && count) {
        lineTime = ytCurrentTime - Number(prevLine["time"]);
      } else {
        lineTime = ytCurrentTime;
      }

      currentLineProgress!.value = lineTime;

      if (
        currentTotalTimeProgress &&
        Math.abs(ytCurrentTime - currentTotalTimeProgress.value) >= map.currentTimeBarFrequency
      ) {
        //ライン経過時間 ＆ 打鍵速度計算
        currentTotalTimeProgress.value = ytCurrentTime;
      }

      const displayRemainTime = playingLineTimeRef.current!.getRemainTime();
      if (Math.abs(Number(currentLine.time) - ytCurrentTime - displayRemainTime) >= 0.1) {
        const currentPlayingCenterRef = playingCenterRef.current;

        const lineWord = currentPlayingCenterRef!.getLineWord();
        const status = tabStatusRef.current!.getStatus();

        playingLineTimeRef.current?.setRemainTime(remainTime);

        if (lineWord.nextChar["k"]) {
          const typeSpeed = new CalcTypeSpeed(status!, lineTime, statusRef);
          playingLineTimeRef.current?.setLineKpm(typeSpeed.lineTypeSpeed);
          tabStatusRef.current!.setStatus({
            ...status!,
            kpm: typeSpeed.totalTypeSpeed,
          });
        }

        skipGuideRef.current!.displaySkipGuide(
          lineWord.nextChar["k"],
          lineTime,
          remainTime,
          skipGuideRef,
        );

        const currentTotalTime = playingTotalTimeRef.current!.getCurrentTime();

        if (Math.abs(ytCurrentTime - currentTotalTime) >= 1) {
          playingTotalTimeRef.current?.setCurrentTime(ytCurrentTime);
        }
      }

      if (nextLine && ytCurrentTime >= Number(currentLine["time"])) {
        const currentPlayingCenterRef = playingCenterRef.current;
        const status = tabStatusRef.current!.getStatus();

        const lineWord = currentPlayingCenterRef!.getLineWord();
        const lineResult = new LineResult(status!, statusRef, lineWord, map, lineTime);

        statusRef.current!.status.result.push({
          status: {
            point: status!.point,
            timeBonus: status!.timeBonus,
            type: status!.type,
            miss: status!.miss,
            combo: playingComboRef.current?.getCombo(),
            clearTime: statusRef.current!.lineStatus.lineClearTime,
            kpm: status!.kpm,
            rkpm: 0,
            lineKpm: playingLineTimeRef.current?.getLineKpm(),
          },
          typeResult: statusRef.current!.lineStatus.typeResult,
        });
        tabStatusRef.current!.setStatus(lineResult.newStatus);
        if (lineWord.nextChar["k"]) {
          statusRef.current!.status.totalTypeTime = lineResult.newTotalTime;
        }

        statusRef.current!.status.count += 1;
        statusRef.current!.lineStatus = structuredClone(defaultStatusRef.lineStatus);
        playingLineTimeRef.current?.setLineKpm(0);
        currentPlayingCenterRef!.setLineWord({
          correct: { k: "", r: "" },
          nextChar: [...map.typePattern[count]][0],
          word: [...map.typePattern[count]].slice(1),
        });

        currentPlayingCenterRef!.setLyrics(currentLine["lyrics"]);
        currentPlayingCenterRef!.setNextLyrics({
          lyrics: nextLine["lyrics"],
          kpm: (map.romaLineSpeedList[count + 1] * 60).toFixed(0),
        });

        if (lineProgressRef.current) {
          const progressElement = lineProgressRef.current as HTMLProgressElement;

          progressElement.max = Number(nextLine["time"]) - Number(currentLine["time"]);
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tabStatusRef.current!.setStatus(structuredClone(defaultStatus));
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
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={playingLineTimeRef} />
      <PlayingCenter ref={playingCenterRef} flex="1" />
      <PlayingBottom
        skipGuideRef={skipGuideRef}
        totalTimeProgressRef={totalTimeProgressRef}
        playingTotalTimeRef={playingTotalTimeRef}
      />
    </Box>
  );
});

Playing.displayName = "Playing";

export default Playing;
