import PlayingCenter, { defaultLineWord, defaultNextLyrics } from "./playing-child/PlayingCenter";
import { RefObject, useEffect } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useLineSelectIndexAtom,
  useMapAtom,
  useRankingScoresAtom,
  useSceneAtom,
  useSetLyricsAtom,
  useSetNextLyricsAtom,
  useTypePageSpeedAtom,
  useUserOptionsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { isTyped } from "@/app/type/ts/scene-ts/playing/keydown/typing";

import { usePlayTimer } from "@/app/type/hooks/playing-hooks/timer-hooks/useTimer";
import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { typeTicker } from "@/app/type/hooks/useYoutubeEvents";
import { PlayingTotalTimeRef } from "./playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./playing-child/child/PlayingSkipGuide";
import { useHandleTyping, usePlayShortcutKey } from "@/app/type/hooks/useKeydownHandle";
import { useGamePause } from "@/app/type/hooks/playing-hooks/useGamePause";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useToggleLineList } from "@/app/type/hooks/playing-hooks/useToggleLineList";
import { useGetCurrentLineTime } from "@/app/type/hooks/useGetCurrentLineTime";

interface PlayingProps {
  drawerClosure: UseDisclosureReturn;
  playingTotalTimeRef: RefObject<PlayingTotalTimeRef>;
  skipGuideRef: RefObject<SkipGuideRef>;
  totalTimeProgressRef: RefObject<HTMLProgressElement>;
}
const Playing = ({
  drawerClosure,
  playingTotalTimeRef,
  skipGuideRef,
  totalTimeProgressRef,
}: PlayingProps) => {
  const { onOpen } = drawerClosure;
  const { statusRef, lineProgressRef, ytStateRef, playingTypingWordsRef } = useRefs();

  const map = useMapAtom() as CreateMap;

  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();
  const inputMode = useInputModeAtom();
  const rankingScores = useRankingScoresAtom();
  const lineResults = useLineResultsAtom();
  const lineSelectIndex = useLineSelectIndexAtom();
  const userOptionsAtom = useUserOptionsAtom();
  const getCurrentLineTime = useGetCurrentLineTime();

  const gamePause = useGamePause();
  const toggleLineListDrawer = useToggleLineList();
  const playTimer = usePlayTimer();
  const handleTyping = useHandleTyping();
  const playShortcutKey = usePlayShortcutKey();
  const setLyrics = useSetLyricsAtom();
  const setNextLyrics = useSetNextLyricsAtom();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const lineWord = playingTypingWordsRef.current!.getLineWord();
      const cloneLineWord = structuredClone(lineWord);

      if (!ytStateRef.current?.isPaused) {
        //ライン切り替えギリギリのタイミングは処理されないようにしてみる(切り替えバグが起こるので)
        const count = statusRef.current!.status.count;

        if (count - 1 < 0) {
          return;
        }

        const lineTime = getCurrentLineTime();

        if (
          count - 1 == lineWord.lineCount &&
          isTyped({ event, lineWord: cloneLineWord }) &&
          scene !== "replay"
        ) {
          event.preventDefault();

          handleTyping({
            event,
            cloneLineWord,
            lineTime,
            count,
          });
        } else {
          playShortcutKey(event, skipGuideRef, lineTime, drawerClosure);
        }
      } else if (event.key === "Escape") {
        gamePause();
      } else if (userOptionsAtom.toggleInputModeKey === "tab" && event.code === "F1") {
        toggleLineListDrawer(drawerClosure);
      } else if (userOptionsAtom.toggleInputModeKey !== "tab" && event.code === "Tab") {
        toggleLineListDrawer(drawerClosure);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputMode,
    rankingScores,
    speedData,
    scene,
    lineResults,
    drawerClosure.isOpen,
    lineSelectIndex,
  ]);

  useEffect(() => {
    const updateFunction = () => playTimer(totalTimeProgressRef, playingTotalTimeRef, skipGuideRef);
    typeTicker.add(updateFunction);

    return () => {
      typeTicker.remove(updateFunction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedData, rankingScores, inputMode, map, scene, lineResults, userOptionsAtom]);

  useEffect(() => {
    const currentPlayingTypingWordsRef = playingTypingWordsRef.current;
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

      currentPlayingTypingWordsRef!.setLineWord(structuredClone(defaultLineWord));
      setLyrics("");
      setNextLyrics(structuredClone(defaultNextLyrics));
      currentTotalTimeProgress!.value = 0;
      currentLineProgress!.value = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PlayingCenter flex="1" />;
};

export default Playing;
