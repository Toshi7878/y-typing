import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  inputModeAtom,
  mapAtom,
  playingNotifyAtom,
  rankingScoresAtom,
  sceneAtom,
  speedAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import PlayingBottom from "./child/PlayingBottom";
import { SkipGuideRef } from "./child/child/PlayingSkipGuide";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";
import { CalcTypeSpeed } from "@/app/type/(ts)/calcTypeSpeed";
import { PlayingRef, StatusRef } from "@/app/type/(ts)/type";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./child/child/PlayingTotalTime";
import { Ticker } from "@pixi/ticker";
import { updateTimer } from "@/app/type/(ts)/timer";
import { romaConvert } from "@/app/type/(ts)/createTypingWord";
export const ticker = new Ticker();

const Playing = forwardRef<PlayingRef>((props, ref) => {
  const {
    playerRef,
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
  const [inputMode, setInputMode] = useAtom(inputModeAtom);
  const [rankingScores] = useAtom(rankingScoresAtom);

  useImperativeHandle(ref, () => ({
    retry: () => {
      const currentPlayingCenterRef = playingCenterRef.current; // 追加
      currentPlayingCenterRef!.resetWordLyrics();

      (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
      tabStatusRef.current!.resetStatus();
      playingComboRef.current?.setCombo(0);
      gameStateRef.current!.replayKeyCount = 0;
      setNotify("Retry");
      gameStateRef.current!.isRetrySkip = true;
      playerRef.current.seekTo(0);
      if (ticker.started) {
        ticker.stop();
      }
    },
    pressSkip: () => {
      const nextLine = map!.words[statusRef.current!.status.count];
      const skippedTime = gameStateRef.current!.isRetrySkip
        ? Number(map!.words[map!.startLine]["time"])
        : Number(nextLine["time"]);

      const seekTime =
        nextLine["lyrics"] === "end"
          ? ytStateRef.current!.movieEndTime - 2
          : skippedTime - 1 + (1 - speedData.playSpeed);

      playerRef.current.seekTo(seekTime);
      skipGuideRef.current?.setSkipGuide?.("");
    },
    realtimeSpeedChange: () => {
      new YTSpeedController("change", { speedData, setSpeedData, playerRef: playerRef.current });
    },
    setRealTimeSpeed: (speed: number) => {
      new YTSpeedController("setSpeed", {
        speedData,
        setSpeedData,
        playerRef: playerRef.current,
        speed: speed,
      });
    },
    gamePause: () => {
      if (ytStateRef.current?.isPaused) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    },
    inputModeChange: (changeInputMode: string) => {
      if (changeInputMode === inputMode) {
        return;
      }

      if (changeInputMode === "kana") {
        setInputMode("kana");
        setNotify("KanaMode");
      } else {
        setInputMode("roma");
        setNotify("Romaji");
        const lineWord = playingCenterRef.current!.getLineWord();

        if (lineWord.nextChar["k"]) {
          const wordFix = romaConvert(lineWord);

          playingCenterRef.current!.setLineWord({
            correct: lineWord.correct,
            nextChar: wordFix.nextChar,
            word: wordFix.word,
            lineCount: lineWord.lineCount,
          });
        }
      }

      const count = statusRef.current!.status.count;
      const nextLine = map!.words[count];
      const nextKpm =
        (inputMode === "roma" ? map!.words[count].kpm["r"] : map!.words[count].kpm["k"]) *
        speedData.playSpeed;
      if (nextKpm) {
        playingCenterRef.current!.setNextLyrics({
          lyrics: nextLine["lyrics"],
          kpm: nextKpm.toFixed(0),
        });
      }
    },
  }));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("playingRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedData, inputMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const lineWord = playingCenterRef.current!.getLineWord();

      const cloneLineWord = structuredClone(lineWord);

      if (!ytStateRef.current?.isPaused) {
        //ライン切り替えギリギリのタイミングは処理されないようにしてみる(切り替えバグが起こるので)
        const count = statusRef.current!.status.count;
        const prevLine = map!.words[count - 1];
        const lineTime = Number(ytStateRef.current!.currentTime) - Number(prevLine.time);

        if (
          count - 1 == lineWord.lineCount &&
          isTyped({ event, lineWord: cloneLineWord }) &&
          scene === "playing"
        ) {
          const result = new Typing({ event, lineWord: cloneLineWord, inputMode });
          const lineConstantTime = lineTime / speedData.playSpeed;

          const status = tabStatusRef.current!.getStatus();

          if (result.successKey) {
            const currentLine = map!.words[count];
            const remainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;
            const typeSpeed = new CalcTypeSpeed(status!, lineConstantTime, statusRef);

            const success = new Success(
              status,
              statusRef,
              result.successKey,
              lineConstantTime,
              playingComboRef,
              inputMode,
              result.updatePoint,
              result.newLineWord,
              map!,
              lineTime,
              typeSpeed.totalKpm,
              remainTime,
              rankingScores,
              scene,
            );

            tabStatusRef.current!.setStatus(success.newStatus);
            playingCenterRef.current!.setLineWord(result.newLineWord);
            playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
            if (!result.newLineWord.nextChar["k"]) {
              statusRef.current!.status.totalTypeTime += lineConstantTime;
            }
          } else if (result.newLineWord.correct["r"] || result.newLineWord.correct["k"]) {
            const miss = new Miss(status, statusRef, result.failKey, playingComboRef, lineTime);
            tabStatusRef.current!.setStatus(miss.newStatus);
          }
        } else {
          shortcutKey(event, skipGuideRef, playingRef, statusRef, inputMode, lineTime, scene);
        }
      } else if (event.key === "Escape") {
        playingRef.current?.gamePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode, rankingScores, speedData, scene]);

  useEffect(() => {
    const updateFunction = () =>
      updateTimer(
        map!,
        playerRef,
        ytStateRef,
        speedData,
        totalTimeProgressRef,
        playingTotalTimeRef,
        playingLineTimeRef,
        playingCenterRef,
        lineProgressRef,
        skipGuideRef,
        statusRef,
        tabStatusRef,
        gameStateRef,
        rankingScores,
        playingComboRef,
        inputMode,
        ref as React.RefObject<PlayingRef>,
        scene,
      );
    ticker.add(updateFunction);

    return () => {
      ticker.remove(updateFunction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedData, rankingScores, inputMode, map, scene]);

  useEffect(() => {
    const currentPlayingCenterRef = playingCenterRef.current; // 追加
    const currentTotalTimeProgress = totalTimeProgressRef.current;
    currentTotalTimeProgress!.max = map?.movieTotalTime ?? 0;

    if (!ticker.started) {
      ticker.start();
    }

    return () => {
      if (ticker.started) {
        ticker.stop();
      }

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
      {map!.mapData[0].options?.eternalCSS && <style>{map!.mapData[0].options?.eternalCSS}</style>}
    </Box>
  );
});

Playing.displayName = "Playing";

export default Playing;
