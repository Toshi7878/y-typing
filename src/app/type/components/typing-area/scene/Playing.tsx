import PlayingCenter, { PlayingCenterRef } from "./playing-child/PlayingCenter";
import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import {
  lineResultsAtom,
  lineSelectIndexAtom,
  mapAtom,
  rankingScoresAtom,
  speedAtom,
  useInputModeAtom,
  useSceneAtom,
  useSetInputModeAtom,
  useSetPlayingNotifyAtom,
  useSetSceneAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useAtom, useAtomValue } from "jotai";
import { isTyped } from "@/app/type/ts/scene-ts/playing/keydown/typing";
import { PlayingRef, StatusRef } from "@/app/type/ts/type";
import { realtimeChange, YTSpeedController } from "@/app/type/ts/ytHandleEvents";

import { setNewLine, updateTimer } from "@/app/type/ts/scene-ts/playing/typeTimer";
import { CreateMap, romaConvert } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { getLineCount, typeTicker } from "@/app/type/ts/youtubeEvents";
import { PlayingTotalTimeRef } from "./playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./playing-child/child/PlayingSkipGuide";
import { handleTyping, shortcutKey } from "@/app/type/ts/scene-ts/playing/keydown/keydownHandle";
import { defaultGameStateRef, defaultStatusRef } from "@/app/type/ts/const/typeDefaultValue";

interface PlayingProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  playingTotalTimeRef: RefObject<PlayingTotalTimeRef>;
  skipGuideRef: RefObject<SkipGuideRef>;
  totalTimeProgressRef: RefObject<HTMLProgressElement>;
}
const Playing = forwardRef<PlayingRef, PlayingProps>(
  ({ isOpen, onOpen, onClose, playingTotalTimeRef, skipGuideRef, totalTimeProgressRef }, ref) => {
    const {
      playerRef,
      playingComboRef,
      tabStatusRef,
      playingRef,
      statusRef,
      playingLineTimeRef,
      lineProgressRef,
      ytStateRef,
      gameStateRef,
      setRef,
    } = useRefs();

    const map = useAtomValue(mapAtom) as CreateMap;

    const playingCenterRef = useRef<PlayingCenterRef>(null);
    const scene = useSceneAtom();
    const setScene = useSetSceneAtom();
    const setNotify = useSetPlayingNotifyAtom();
    const [speedData, setSpeedData] = useAtom(speedAtom);
    const inputMode = useInputModeAtom();
    const setInputMode = useSetInputModeAtom();
    const rankingScores = useAtomValue(rankingScoresAtom);
    const [lineResults, setLineResults] = useAtom(lineResultsAtom);
    const [lineSelectIndex, setLineSelectIndex] = useAtom(lineSelectIndexAtom);

    //forwardRefやめる？（あとで
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
        if (typeTicker.started) {
          typeTicker.stop();
        }
      },
      pressSkip: () => {
        const nextLine = map!.mapData[statusRef.current!.status.count];
        const skippedTime = gameStateRef.current!.isRetrySkip
          ? Number(map!.mapData[map!.startLine]["time"])
          : Number(nextLine["time"]);

        const seekTime =
          nextLine["lyrics"] === "end"
            ? ytStateRef.current!.movieDuration - 2
            : skippedTime - 1 + (1 - speedData.playSpeed);

        playerRef.current.seekTo(seekTime);
        gameStateRef.current!.isRetrySkip = false;
        skipGuideRef.current?.setSkipGuide?.("");
      },
      realtimeSpeedChange: () => {
        const newSpeed = realtimeChange({
          speedData,
          setSpeedData,
          playerRef: playerRef.current,
        });

        setNotify(Symbol(`${newSpeed.toFixed(2)}x`));
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
        if (isOpen && gameStateRef.current!.isSeekedLine) {
          return;
        }
        const count = statusRef.current!.status.count - (scene === "replay" ? 1 : 0);
        const prevCount = structuredClone(map!.typingLineNumbers)
          .reverse()
          .find((num) => num < count);

        if (prevCount === undefined) {
          return;
        }

        const seekBuffer = scene === "practice" ? 1 * speedData.playSpeed : 0;
        const prevTime = Number(map!.mapData[prevCount]["time"]) - seekBuffer;
        setLineSelectIndex(map!.typingLineNumbers.indexOf(prevCount) + 1);
        if (typeTicker.started) {
          typeTicker.stop();
        }

        if (!isOpen) {
          const newCount = getLineCount(prevTime, map!.mapData);
          statusRef.current!.status.count = newCount;
          setNewLine(
            newCount,
            scene,
            statusRef,
            map!,
            inputMode,
            speedData,
            playingLineTimeRef,
            playingCenterRef,
            lineProgressRef,
            lineResults,
            gameStateRef,
            playingRef,
            ytStateRef,
          );
        } else {
          gameStateRef.current!.isSeekedLine = true;
        }

        playerRef.current.seekTo(prevTime);
        setNotify(Symbol(`◁`));
      },

      nextLine: () => {
        if (isOpen && gameStateRef.current!.isSeekedLine) {
          return;
        }
        const seekCount = lineSelectIndex ? map!.typingLineNumbers[lineSelectIndex - 1] : null;
        const seekCountAdjust = seekCount && seekCount === statusRef.current!.status.count ? 0 : -1;

        const count = statusRef.current!.status.count + seekCountAdjust;
        const nextCount = map!.typingLineNumbers.find((num) => num > count);

        if (nextCount === undefined) {
          return;
        }

        const prevLineTime =
          (nextCount > 1
            ? map!.mapData[nextCount]["time"] - map!.mapData[nextCount - 1]["time"]
            : 0) / speedData.playSpeed;

        const seekBuffer = scene === "practice" && prevLineTime > 1 ? 1 * speedData.playSpeed : 0;
        const nextTime = count > 0 ? Number(map!.mapData[nextCount]["time"]) - seekBuffer : 0;

        const typingLineCount = map!.typingLineNumbers.indexOf(nextCount) + 1;

        setLineSelectIndex(typingLineCount);
        if (typeTicker.started) {
          typeTicker.stop();
        }

        if (!isOpen) {
          const newCount = getLineCount(nextTime, map!.mapData);
          statusRef.current!.status.count = newCount;
          setNewLine(
            newCount,
            scene,
            statusRef,
            map!,
            inputMode,
            speedData,
            playingLineTimeRef,
            playingCenterRef,
            lineProgressRef,
            lineResults,
            gameStateRef,
            playingRef,
            ytStateRef,
          );
        } else {
          gameStateRef.current!.isSeekedLine = true;
        }
        playerRef.current.seekTo(nextTime);
        setNotify(Symbol(`▷`));
      },

      practiceSetLine: () => {
        if (!lineSelectIndex) {
          return;
        }
        gameStateRef.current!.isSeekedLine = true;

        const seekCount = map!.typingLineNumbers[lineSelectIndex - 1];

        const seekBuffer = scene === "practice" ? 1 * speedData.playSpeed : 0;

        const seekTime = Number(map!.mapData[seekCount]["time"]) - seekBuffer;

        playerRef.current.seekTo(seekTime);
      },
      practiceSpeedUp: () => {
        const result = new YTSpeedController("up", {
          speedData,
          setSpeedData,
          playerRef: playerRef!.current,
        });

        if (result.result) {
          setNotify(Symbol(`${result.result!.toFixed(2)}x`));
        }
      },
      practiceSpeedDown: () => {
        const result = new YTSpeedController("down", {
          speedData,
          setSpeedData,
          playerRef: playerRef!.current,
        });

        if (result.result) {
          setNotify(Symbol(`${result.result!.toFixed(2)}x`));
        }
      },

      changePlayMode: () => {
        if (scene === "playing") {
          const confirmMessage = "練習モードに移動しますか？";
          if (window.confirm(confirmMessage)) {
            gameStateRef.current!.playMode = "practice";
            setScene("practice");
          }
        } else {
          const confirmMessage = "本番モードに移動しますか？了承すると初めから再生されます。";
          if (window.confirm(confirmMessage)) {
            gameStateRef.current!.practice = structuredClone(defaultGameStateRef.practice);
            gameStateRef.current!.replay = structuredClone(defaultGameStateRef.replay);
            gameStateRef.current!.playMode = "playing";
            setScene("playing");
            onClose();
            playingRef.current!.retry();
            setNotify(Symbol(""));
          }
        }
      },
    }));

    useEffect(() => {
      if (ref && "current" in ref) {
        setRef("playingRef", ref.current!);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speedData, inputMode, isOpen, lineSelectIndex, scene]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const lineWord = playingCenterRef.current!.getLineWord();

        const cloneLineWord = structuredClone(lineWord);

        if (!ytStateRef.current?.isPaused) {
          //ライン切り替えギリギリのタイミングは処理されないようにしてみる(切り替えバグが起こるので)
          const count = statusRef.current!.status.count;

          if (count - 1 < 0) {
            return;
          }
          const prevLine = map!.mapData[count - 1];
          const lineTime = playerRef.current.getCurrentTime() - Number(prevLine.time);

          if (
            count - 1 == lineWord.lineCount &&
            isTyped({ event, lineWord: cloneLineWord }) &&
            scene !== "replay"
          ) {
            event.preventDefault();

            handleTyping({
              event,
              cloneLineWord,
              inputMode,
              lineTime,
              speedData,
              tabStatusRef,
              map,
              count,
              statusRef,
              playingComboRef,
              rankingScores,
              scene,
              playingCenterRef,
              playingLineTimeRef,
              lineResults,
              setLineResults,
              ytStateRef,
            });
          } else {
            shortcutKey(
              event,
              skipGuideRef,
              playingRef,
              statusRef,
              inputMode,
              lineTime,
              scene,
              isOpen,
            );
          }
        } else if (event.key === "Escape") {
          playingRef.current?.gamePause();
        } else if (event.code === "Tab") {
          playingRef.current?.openLineList();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputMode, rankingScores, speedData, scene, lineResults, isOpen]);

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
      typeTicker.add(updateFunction);

      return () => {
        typeTicker.remove(updateFunction);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speedData, rankingScores, inputMode, map, scene, lineResults]);

    useEffect(() => {
      const currentPlayingCenterRef = playingCenterRef.current;
      const currentTotalTimeProgress = totalTimeProgressRef.current;
      const currentLineProgress = lineProgressRef.current;

      const movieDuration = ytStateRef.current!.movieDuration;
      const duration =
        Number(map?.movieTotalTime) > movieDuration ? movieDuration : map?.movieTotalTime;

      currentTotalTimeProgress!.max = duration ?? 0;

      if (!typeTicker.started) {
        typeTicker.start();
      }

      if (scene === "practice") {
        onOpen();
      }
      return () => {
        if (typeTicker.started) {
          typeTicker.stop();
        }

        currentPlayingCenterRef!.resetWordLyrics();
        currentTotalTimeProgress!.value = 0;
        currentLineProgress!.value = 0;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <PlayingCenter ref={playingCenterRef} flex="1" />;
  },
);

Playing.displayName = "Playing";

export default Playing;
