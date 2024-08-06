import { Box, useDisclosure } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import PlayingCenter, { PlayingCenterRef } from "./child/PlayingCenter";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import {
  inputModeAtom,
  lineResultsAtom,
  lineSelectIndexAtom,
  mapAtom,
  playingNotifyAtom,
  rankingScoresAtom,
  sceneAtom,
  speedAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import PlayingBottom from "./child/PlayingBottom";
import { SkipGuideRef } from "./child/child/PlayingSkipGuide";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";
import { CalcTypeSpeed } from "@/app/type/(ts)/calcTypeSpeed";
import { PlayingRef, StatusRef } from "@/app/type/(ts)/type";
import { realtimeChange, YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./child/child/PlayingTotalTime";
import { Ticker } from "@pixi/ticker";
import { updateTimer } from "@/app/type/(ts)/timer";
import { romaConvert } from "@/app/type/(ts)/createTypingWord";
import EndTypingResultModal from "./child/EndTypingResultModal";
import { updateReplayStatus } from "@/app/type/(ts)/replay";
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

  const map = useAtomValue(mapAtom);
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingLineTimeRef = useRef<PlayingLineTimeRef>(null);
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingTotalTimeRef = useRef<PlayingTotalTimeRef>(null);
  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const scene = useAtomValue(sceneAtom);
  const setNotify = useSetAtom(playingNotifyAtom);
  const [speedData, setSpeedData] = useAtom(speedAtom);
  const [inputMode, setInputMode] = useAtom(inputModeAtom);
  const rankingScores = useAtomValue(rankingScoresAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lineResults, setLineResults] = useAtom(lineResultsAtom);
  const [lineSelectIndex, setLineSelectIndex] = useAtom(lineSelectIndexAtom);

  //forwardRefやめる（あとで
  useImperativeHandle(ref, () => ({
    retry: () => {
      const currentPlayingCenterRef = playingCenterRef.current; // 追加
      currentPlayingCenterRef!.resetWordLyrics();

      if (scene !== "practice") {
        tabStatusRef.current!.resetStatus();
        playingComboRef.current?.setCombo(0);
        (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);

        if (scene !== "replay") {
          setLineResults(structuredClone(map!.defaultLineResultData));
        }

        if (scene === "playing") {
          const status = tabStatusRef.current?.getStatus();
          if (status?.type) {
            gameStateRef.current!.retryCount++;
          }
          setNotify(Symbol(`Retry(${gameStateRef.current!.retryCount})`));
        }
      }
      gameStateRef.current!.replay.replayKeyCount = 0;

      gameStateRef.current!.isRetrySkip = true;
      playerRef.current.seekTo(0);
      if (ticker.started) {
        ticker.stop();
      }
    },
    pressSkip: () => {
      const nextLine = map!.mapData[statusRef.current!.status.count];
      const skippedTime = gameStateRef.current!.isRetrySkip
        ? Number(map!.mapData[map!.startLine]["time"])
        : Number(nextLine["time"]);

      const seekTime =
        nextLine["lyrics"] === "end"
          ? ytStateRef.current!.movieEndTime - 2
          : skippedTime - 1 + (1 - speedData.playSpeed);

      playerRef.current.seekTo(seekTime);
      gameStateRef.current!.isRetrySkip = false;
      gameStateRef.current!.isSkip = true;
      skipGuideRef.current?.setSkipGuide?.("");
    },
    realtimeSpeedChange: () => {
      const newSpeed = realtimeChange({
        speedData,
        setSpeedData,
        playerRef: playerRef.current,
      });

      setNotify(Symbol(newSpeed.toFixed(2)));
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
        setNotify(Symbol("KanaMode"));
      } else {
        setInputMode("roma");
        setNotify(Symbol("Romaji"));
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
      const nextLine = map!.mapData[count];
      const nextKpm =
        (inputMode === "roma" ? map!.mapData[count].kpm["r"] : map!.mapData[count].kpm["k"]) *
        speedData.playSpeed;
      if (nextKpm) {
        playingCenterRef.current!.setNextLyrics({
          lyrics: nextLine["lyrics"],
          kpm: nextKpm.toFixed(0),
        });
      }
    },

    openLineList: () => {
      if (!isOpen) {
        onOpen();
      } else {
        onClose();
      }
    },

    prevLine: () => {
      // const setLineCount = gameStateRef.current!.practice.setLineCount;
      // const count = statusRef.current!.status.count;
      // let n = setLineCount !== count ? -1 : 0;
      // while (!map!.typingLineNumbers.includes(count + n) && count + n >= map!.startLine) {
      //   n--;
      // }
      // if (count < map!.startLine) {
      //   return;
      // }
      // const prevCount = count + n;
      // gameStateRef.current!.practice.setLineCount = prevCount - 1;
      // setLineSelectIndex(prevCount);
      // const seekBuffer = scene === "practice" ? 1 / speedData.playSpeed : 0;
      // const prevTime = count - 1 > 0 ? Number(map!.mapData[prevCount]["time"]) - seekBuffer : 0;
      // playerRef.current.seekTo(prevTime);
      // if (ticker.started) {
      //   ticker.stop();
      // }
    },

    nextLine: () => {
      // const setLineCount = gameStateRef.current!.practice.setLineCount;
      // const count = statusRef.current!.status.count;
      // let n = setLineCount !== count ? 1 : 2;
      // if (count - setLineCount > 1) {
      //   n--;
      // }
      // if (
      //   setLineCount > 0 &&
      //   count + 1 - setLineCount <= 1 &&
      //   Number(map!.mapData[setLineCount + 1]["time"]) -
      //     Number(map!.mapData[setLineCount]["time"]) <=
      //     1
      // ) {
      //   n += 2;
      // }
      // while (!map!.typingLineNumbers.includes(count + n) && map!.mapData.length - 1 > count + n) {
      //   n++;
      // }
      // if (map!.mapData.length - 2 < count + n) {
      //   return;
      // }
      // const nextCount = count + n;
      // const seekBuffer = scene === "practice" ? 1 / speedData.playSpeed : 0;
      // const nextTime = count > 0 ? Number(map!.mapData[nextCount]["time"]) - seekBuffer : 0;
      // setLineSelectIndex(nextCount - 1);
      // gameStateRef.current!.replay.isSkip = true;
      // playerRef.current.seekTo(nextTime);
    },

    practiceSetLine: () => {
      const setLineCount = lineSelectIndex;

      if (setLineCount) {
        const seekBuffer = scene === "practice" ? 1 / speedData.playSpeed : 0;

        const seekTime = Number(map!.mapData[setLineCount]["time"]) - seekBuffer;

        playerRef.current.seekTo(seekTime);
      }
    },
  }));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("playingRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedData, inputMode, isOpen, lineSelectIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const lineWord = playingCenterRef.current!.getLineWord();

      const cloneLineWord = structuredClone(lineWord);

      if (!ytStateRef.current?.isPaused) {
        //ライン切り替えギリギリのタイミングは処理されないようにしてみる(切り替えバグが起こるので)
        const count = statusRef.current!.status.count;
        const prevLine = map!.mapData[count - 1];
        const lineTime = playerRef.current.getCurrentTime() - Number(prevLine.time);

        if (
          count - 1 == lineWord.lineCount &&
          isTyped({ event, lineWord: cloneLineWord }) &&
          scene !== "replay"
        ) {
          event.preventDefault();
          const result = new Typing({ event, lineWord: cloneLineWord, inputMode });
          const lineConstantTime = Math.round((lineTime / speedData.playSpeed) * 1000) / 1000;

          const status = tabStatusRef.current!.getStatus();

          if (result.successKey) {
            const currentLine = map!.mapData[count];
            const remainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;
            const typeSpeed = new CalcTypeSpeed("keydown", status!, lineConstantTime, statusRef);

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

            playingCenterRef.current!.setLineWord(result.newLineWord);
            playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);

            if (!result.newLineWord.nextChar["k"] && scene === "practice") {
              const combo = playingComboRef.current!.getCombo();
              const tTime = Math.round(statusRef.current!.status.totalTypeTime * 1000) / 1000;
              const mode = statusRef.current!.lineStatus.lineStartInputMode;
              const sp = statusRef.current!.lineStatus.lineStartSpeed;
              const typeResult = statusRef.current!.lineStatus.typeResult;
              const lResult = lineResults[count - 1];
              const lMiss = statusRef.current!.lineStatus.lineMiss;
              const lineScore = success.newStatus.point + success.newStatus.timeBonus + lMiss * 5;
              const oldLineScore =
                lResult.status!.p! + lResult.status!.tBonus! + lResult.status!.lMiss! * 5;

              const isUpdateResult = lineScore >= oldLineScore;
              const newLineResults = [...lineResults];

              if (isUpdateResult) {
                newLineResults[count - 1] = {
                  status: {
                    p: success.newStatus.point,
                    tBonus: success.newStatus.timeBonus,
                    lType: statusRef.current!.lineStatus.lineType,
                    lMiss,
                    lRkpm: typeSpeed.lineRkpm,
                    lKpm: typeSpeed.lineKpm,
                    lostW: "",
                    lLost: 0,
                    combo,
                    tTime,
                    mode,
                    sp,
                  },
                  typeResult,
                };
                setLineResults(newLineResults);
              }
              const newStatus = updateReplayStatus(
                map!.mapData.length - 1,
                newLineResults,
                map!,
                rankingScores,
              );
              tabStatusRef.current!.setStatus({
                ...newStatus,
                point: success.newStatus.point,
                timeBonus: success.newStatus.timeBonus,
              });
            } else {
              tabStatusRef.current!.setStatus(success.newStatus);
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
  }, [inputMode, rankingScores, speedData, scene, lineResults]);

  useEffect(() => {
    const updateFunction = () =>
      updateTimer(
        map!,
        lineResults,
        setLineResults,
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
  }, [speedData, rankingScores, inputMode, map, scene, lineResults]);

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
      {isOpen && <EndTypingResultModal isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
});

Playing.displayName = "Playing";

export default Playing;
