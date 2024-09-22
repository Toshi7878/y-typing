import PlayingCenter, { PlayingCenterRef } from "./playing-child/PlayingCenter";
import { RefObject, useEffect, useRef } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useMapAtom,
  useRankingScoresAtom,
  useSceneAtom,
  useTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { isTyped } from "@/app/type/ts/scene-ts/playing/keydown/typing";

import { usePlayTimer } from "@/app/type/hooks/playing-hooks/timer-hooks/useTimer";
import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { typeTicker } from "@/app/type/hooks/useYoutubeEvents";
import { PlayingTotalTimeRef } from "./playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./playing-child/child/PlayingSkipGuide";
import {
  useHandleTyping,
  usePlayShortcutKey,
} from "@/app/type/ts/scene-ts/playing/keydown/keydownHandle";
import { useGamePause } from "@/app/type/hooks/playing-hooks/useGamePause";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useToggleLineList } from "@/app/type/hooks/playing-hooks/useToggleLineList";

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
  const { isOpen, onOpen } = drawerClosure;
  const { playerRef, statusRef, lineProgressRef, ytStateRef } = useRefs();

  const map = useMapAtom() as CreateMap;

  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();
  const inputMode = useInputModeAtom();
  const rankingScores = useRankingScoresAtom();
  const lineResults = useLineResultsAtom();
  const gamePause = useGamePause();
  const toggleLineListDrawer = useToggleLineList();
  const playTimer = usePlayTimer();
  const handleTyping = useHandleTyping();
  const playShortcutKey = usePlayShortcutKey();

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
            lineTime,
            count,
          });
        } else {
          playShortcutKey(event, skipGuideRef, lineTime, drawerClosure);
        }
      } else if (event.key === "Escape") {
        gamePause();
      } else if (event.code === "Tab") {
        toggleLineListDrawer(drawerClosure);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode, rankingScores, speedData, scene, lineResults, drawerClosure.isOpen]);

  useEffect(() => {
    const updateFunction = () => playTimer(totalTimeProgressRef, playingTotalTimeRef, skipGuideRef);
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
};

export default Playing;
