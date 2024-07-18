import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  inputModeAtom,
  mapAtom,
  playingNotifyAtom,
  sceneAtom,
  speedAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { timer } from "@/app/type/(ts)/timer";
import PlayingBottom from "./child/PlayingBottom";
import { SkipGuideRef } from "./child/child/PlayingSkipGuide";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";
import { LineResult } from "@/app/type/(ts)/lineResult";
import { CalcTypeSpeed } from "@/app/type/(ts)/calcTypeSpeed";
import { LineResultObj, PlayingRef, StatusRef } from "@/app/type/(ts)/type";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./child/child/PlayingTotalTime";
import { Ticker } from "@pixi/ticker";
export const ticker = new Ticker();

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

const Playing = forwardRef<PlayingRef>((props, ref) => {
  const {
    playerRef,
    tabRankingListRef,
    playingComboRef,
    tabStatusRef,
    playingRef,
    statusRef,
    ytStateRef,
    gameStateRef,
    setRef,
  } = useRefs();

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
  const [inputMode] = useAtom(inputModeAtom);

  useImperativeHandle(ref, () => ({
    retry: () => {
      const currentPlayingCenterRef = playingCenterRef.current; // 追加
      currentPlayingCenterRef!.resetWordLyrics();

      (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
      tabStatusRef.current!.resetStatus();
      playingComboRef.current?.setCombo(0);
      setNotify("Retry");
      gameStateRef.current!.isRetrySkip = true;
      playerRef.current.seekTo(0);
      if (ticker.started) {
        ticker.stop();
      }
    },
    pressSkip: () => {
      const nextLine = map!.data[statusRef.current!.status.count];
      const skippedTime = gameStateRef.current!.isRetrySkip
        ? Number(map!.data[map!.startLine]["time"])
        : Number(nextLine["time"]);

      playerRef.current.seekTo(skippedTime - 1 + (1 - speedData.realtimeSpeed));
      skipGuideRef.current?.setSkipGuide?.("");
    },
    realtimeSpeedChange: () => {
      new YTSpeedController("change", { speedData, setSpeedData, playerRef: playerRef.current });
    },
    gamePause: () => {
      if (ytStateRef.current?.isPaused) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    },
  }));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("playingRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const lineWord = playingCenterRef.current!.getLineWord();

      const cloneLineWord = structuredClone(lineWord);
      if (!ytStateRef.current?.isPaused) {
        if (isTyped({ event, lineWord: cloneLineWord })) {
          const count = statusRef.current!.status.count;
          const result = new Typing({ event, lineWord: cloneLineWord, inputMode });
          const prevLine = map!.data[count - 1];
          const lineTime = Number(ytStateRef.current!.currentTime) - Number(prevLine.time);
          const status = tabStatusRef.current!.getStatus();

          if (result.successKey) {
            const currentLine = map!.data[count];
            const remainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;

            const success = new Success(
              status,
              statusRef,
              playingComboRef,
              inputMode,
              result.updatePoint,
              result.newLineWord,
              map!,
              lineTime,
              remainTime,
              result.successKey,
            );

            tabStatusRef.current!.setStatus(success.newStatus);
            playingCenterRef.current!.setLineWord(result.newLineWord);
            playingLineTimeRef.current?.setLineKpm(success.lineTypeSpeed);
            if (!result.newLineWord.nextChar["k"]) {
              statusRef.current!.status.totalTypeTime += lineTime;
            }
          } else if (result.newLineWord.correct["r"] || result.newLineWord.correct["k"]) {
            const miss = new Miss(status, statusRef, playingComboRef, lineTime, event.key);
            tabStatusRef.current!.setStatus(miss.newStatus);
          }
        } else {
          shortcutKey(event, skipGuideRef, playingRef);
        }
      } else if (event.key === "Escape") {
        playingRef.current?.gamePause();
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
  }, [inputMode]);

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

        const isRetrySkip = gameStateRef.current!.isRetrySkip;

        if (isRetrySkip && Number(map.data[map.startLine]["time"]) - 1 <= ytCurrentTime) {
          gameStateRef.current!.isRetrySkip = false;
        }

        skipGuideRef.current!.displaySkipGuide(
          lineWord.nextChar["k"],
          lineTime,
          remainTime,
          skipGuideRef,
          isRetrySkip,
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
        const typeSpeed = new CalcTypeSpeed(status!, lineTime, statusRef);

        const lineResult = new LineResult(
          status!,
          statusRef,
          lineWord,
          map,
          lineTime,
          typeSpeed.totalTypeSpeed,
        );

        statusRef.current!.status.result.push({
          status: {
            point: status!.point,
            timeBonus: status!.timeBonus,
            type: status!.type,
            miss: status!.miss,
            combo: playingComboRef.current?.getCombo(),
            clearTime: statusRef.current!.lineStatus.lineClearTime,
            kpm: typeSpeed.lineTypeSpeed,
            rkpm: typeSpeed.lineTypeRkpm,
            lineKpm: playingLineTimeRef.current?.getLineKpm(),
          },
          typeResult: statusRef.current!.lineStatus.typeResult,
        });
        tabStatusRef.current!.setStatus(lineResult.newStatus);
        if (lineWord.nextChar["k"]) {
          statusRef.current!.status.totalTypeTime = lineResult.newTotalTime;
        }
        statusRef.current!.status.totalLatency = statusRef.current!.lineStatus.latency;

        statusRef.current!.status.count += 1;
        statusRef.current!.lineStatus = structuredClone(defaultStatusRef.lineStatus);
        playingLineTimeRef.current?.setLineKpm(0);
        statusRef.current!.lineStatus.latency = 0;
        currentPlayingCenterRef!.setLineWord({
          correct: { k: "", r: "" },
          nextChar: [...map.typePattern[count]][0],
          word: [...map.typePattern[count]].slice(1),
        });

        currentPlayingCenterRef!.setLyrics(currentLine["lyrics"]);

        const nextKpm =
          inputMode === "roma"
            ? map.romaLineSpeedList[count + 1]
            : map.kanaLineSpeedList[count + 1];
        if (nextKpm) {
          currentPlayingCenterRef!.setNextLyrics({
            lyrics: nextLine["lyrics"],
            kpm: (nextKpm * 60).toFixed(0),
          });
        } else {
          currentPlayingCenterRef!.setNextLyrics({
            lyrics: "",
            kpm: "",
          });
        }

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
    const updateFunction = () => timer.update(playerRef);
    ticker.add(updateFunction);

    timer.addListener(updateLine);
    const currentPlayingCenterRef = playingCenterRef.current; // 追加
    const currentTotalTimeProgress = totalTimeProgressRef.current;
    currentTotalTimeProgress!.max = map?.movieTotalTime ?? 0;

    if (!ticker.started) {
      ticker.start();
    }

    return () => {
      timer.removeListener(updateLine);
      if (ticker.started) {
        ticker.stop();
      }
      ticker.remove(updateFunction);

      currentPlayingCenterRef!.resetWordLyrics();
      setNotify("");

      if (scene !== "end" && scene !== "playing") {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tabStatusRef.current!.resetStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="flex" flexDirection="column" className="select-none">
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
