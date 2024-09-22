import { useRefs } from "../../type-contexts/refsProvider";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useLineSelectIndexAtom,
  useMapAtom,
  useSceneAtom,
  useSetLineSelectIndexAtom,
  useSetPlayingNotifyAtom,
  useTypePageSpeedAtom,
} from "../../type-atoms/gameRenderAtoms";
import { getLineCount, typeTicker } from "../../ts/youtubeEvents";
import { setNewLine } from "../../ts/scene-ts/playing/typeTimer";
import { useSetRealTimeSpeed } from "./useSpeedChange";
import { useInputModeChange } from "./useInputModeChange";
import { UseDisclosureReturn } from "@chakra-ui/react";

export const useMoveLine = () => {
  const {
    gameStateRef,
    statusRef,
    playingLineTimeRef,
    playingCenterRef,
    lineProgressRef,
    ytStateRef,
    playerRef,
  } = useRefs();
  const scene = useSceneAtom();
  const map = useMapAtom();
  const speedData = useTypePageSpeedAtom();
  const inputMode = useInputModeAtom();
  const lineSelectIndex = useLineSelectIndexAtom();
  const lineResults = useLineResultsAtom();
  const inputModeChange = useInputModeChange();
  const setLineSelectIndex = useSetLineSelectIndexAtom();
  const setRealTimeSpeed = useSetRealTimeSpeed();
  const setNotify = useSetPlayingNotifyAtom();

  const movePrevLine = (drawerClosure: UseDisclosureReturn) => {
    if (drawerClosure.isOpen && gameStateRef.current!.isSeekedLine) {
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

    if (!drawerClosure.isOpen) {
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
        ytStateRef,
        setRealTimeSpeed,
        inputModeChange,
      );
    } else {
      gameStateRef.current!.isSeekedLine = true;
    }

    playerRef.current.seekTo(prevTime);
    setNotify(Symbol(`◁`));
  };

  const moveNextLine = (drawerClosure: UseDisclosureReturn) => {
    if (drawerClosure.isOpen && gameStateRef.current!.isSeekedLine) {
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
      (nextCount > 1 ? map!.mapData[nextCount]["time"] - map!.mapData[nextCount - 1]["time"] : 0) /
      speedData.playSpeed;

    const seekBuffer = scene === "practice" && prevLineTime > 1 ? 1 * speedData.playSpeed : 0;
    const nextTime = count > 0 ? Number(map!.mapData[nextCount]["time"]) - seekBuffer : 0;

    const typingLineCount = map!.typingLineNumbers.indexOf(nextCount) + 1;

    setLineSelectIndex(typingLineCount);
    if (typeTicker.started) {
      typeTicker.stop();
    }

    if (!drawerClosure.isOpen) {
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
        ytStateRef,
        setRealTimeSpeed,
        inputModeChange,
      );
    } else {
      gameStateRef.current!.isSeekedLine = true;
    }
    playerRef.current.seekTo(nextTime);
    setNotify(Symbol(`▷`));
  };

  const moveSetLine = () => {
    if (!lineSelectIndex) {
      return;
    }
    gameStateRef.current!.isSeekedLine = true;

    const seekCount = map!.typingLineNumbers[lineSelectIndex - 1];

    const seekBuffer = scene === "practice" ? 1 * speedData.playSpeed : 0;

    const seekTime = Number(map!.mapData[seekCount]["time"]) - seekBuffer;

    playerRef.current.seekTo(seekTime);
  };
  return { movePrevLine, moveNextLine, moveSetLine };
};
