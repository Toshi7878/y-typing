import PlayingCenter, { PlayingCenterRef } from "./playing-child/PlayingCenter";
import { forwardRef, RefObject, useEffect, useRef } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useLineSelectIndexAtom,
  useMapAtom,
  useRankingScoresAtom,
  useSceneAtom,
  useSetLineResultsAtom,
  useTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { isTyped } from "@/app/type/ts/scene-ts/playing/keydown/typing";

import { updateTimer } from "@/app/type/ts/scene-ts/playing/typeTimer";
import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { typeTicker } from "@/app/type/ts/youtubeEvents";
import { PlayingTotalTimeRef } from "./playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./playing-child/child/PlayingSkipGuide";
import { handleTyping, shortcutKey } from "@/app/type/ts/scene-ts/playing/keydown/keydownHandle";
import { useRetry } from "@/app/type/hooks/playing-hooks/useRetry";
import { usePressSkip } from "@/app/type/hooks/playing-hooks/usePressSkip";
import {
  useRealTimeSpeedChange,
  useSetRealTimeSpeed,
} from "@/app/type/hooks/playing-hooks/useSpeedChange";
import { useGamePause } from "@/app/type/hooks/playing-hooks/useGamePause";
import { useInputModeChange } from "@/app/type/hooks/playing-hooks/useInputModeChange";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useToggleLineList } from "@/app/type/hooks/playing-hooks/useToggleLineList";
import { useMoveLine } from "@/app/type/hooks/playing-hooks/useMoveLine";
import { useChangePlayMode } from "@/app/type/hooks/playing-hooks/useChangePlayMode";
import { useChangePracticeSpeed } from "@/app/type/hooks/playing-hooks/usePracticeSpeedChange";

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
  const {
    playerRef,
    playingComboRef,
    tabStatusRef,
    statusRef,
    playingLineTimeRef,
    lineProgressRef,
    ytStateRef,
    gameStateRef,
  } = useRefs();

  const map = useMapAtom() as CreateMap;

  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();
  const inputMode = useInputModeAtom();
  const rankingScores = useRankingScoresAtom();
  const lineResults = useLineResultsAtom();
  const setLineResults = useSetLineResultsAtom();

  const retry = useRetry();
  const pressSkip = usePressSkip();
  const realTimeSpeedChange = useRealTimeSpeedChange();
  const setRealTimeSpeed = useSetRealTimeSpeed();
  const gamePause = useGamePause();
  const inputModeChange = useInputModeChange();
  const toggleLineListDrawer = useToggleLineList();
  const changePlayMode = useChangePlayMode();
  const changePracticeSpeed = useChangePracticeSpeed();
  const { movePrevLine, moveNextLine, moveSetLine } = useMoveLine();

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
            statusRef,
            inputMode,
            lineTime,
            scene,
            isOpen,
            drawerClosure,
            retry,
            pressSkip,
            realTimeSpeedChange,
            gamePause,
            inputModeChange,
            movePrevLine,
            moveNextLine,
            moveSetLine,
            toggleLineListDrawer,
            changePlayMode,
            changePracticeSpeed,
          );
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
        scene,
        realTimeSpeedChange,
        setRealTimeSpeed,
        inputModeChange,
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
};

export default Playing;
