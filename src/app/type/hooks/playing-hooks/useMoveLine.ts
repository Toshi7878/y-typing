import { ThemeColors } from "@/types";
import { UseDisclosureReturn, useTheme } from "@chakra-ui/react";
import { useStore } from "jotai";
import {
  lineSelectIndexAtom,
  speedAtom,
  useMapAtom,
  useSceneAtom,
  useSetLineSelectIndexAtom,
  useSetPlayingNotifyAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { typeTicker } from "../useYoutubeEvents";
import { useGetSeekLineCount } from "./timer-hooks/useSeekGetLineCount";
import { useUpdateLine } from "./timer-hooks/useTimer";

export const useMoveLine = () => {
  const { statusRef, playerRef, cardRefs } = useRefs();
  const scene = useSceneAtom();
  const map = useMapAtom();
  const typeAtomStore = useStore();
  const theme: ThemeColors = useTheme();
  const setLineSelectIndex = useSetLineSelectIndexAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const updateLine = useUpdateLine();
  const getSeekLineCount = useGetSeekLineCount();

  const movePrevLine = (drawerClosure: UseDisclosureReturn) => {
    const count = statusRef.current!.status.count - (scene === "replay" ? 1 : 0);
    const prevCount = structuredClone(map!.typingLineNumbers)
      .reverse()
      .find((num) => num < count);

    if (prevCount === undefined) {
      return;
    }
    const playSpeed = typeAtomStore.get(speedAtom).playSpeed;

    const seekBuffer = scene === "practice" ? 1 * playSpeed : 0;
    const prevTime = Number(map!.mapData[prevCount]["time"]) - seekBuffer;
    const newLineSelectIndex = map!.typingLineNumbers.indexOf(prevCount) + 1;
    setLineSelectIndex(newLineSelectIndex);
    if (typeTicker.started) {
      typeTicker.stop();
    }

    const newCount = getSeekLineCount(prevTime);
    statusRef.current!.status.count = newCount;
    updateLine(newCount);

    playerRef.current.seekTo(prevTime);
    setNotify(Symbol(`◁`));
    drawerSelectColorChange(newLineSelectIndex);
  };

  const moveNextLine = (drawerClosure: UseDisclosureReturn) => {
    const lineSelectIndex = typeAtomStore.get(lineSelectIndexAtom);
    const seekCount = lineSelectIndex ? map!.typingLineNumbers[lineSelectIndex - 1] : null;
    const seekCountAdjust = seekCount && seekCount === statusRef.current!.status.count ? 0 : -1;

    const count = statusRef.current!.status.count + seekCountAdjust;
    const nextCount = map!.typingLineNumbers.find((num) => num > count);

    if (nextCount === undefined) {
      return;
    }

    const playSpeed = typeAtomStore.get(speedAtom).playSpeed;

    const prevLineTime =
      (nextCount > 1 ? map!.mapData[nextCount]["time"] - map!.mapData[nextCount - 1]["time"] : 0) /
      playSpeed;

    const seekBuffer = scene === "practice" && prevLineTime > 1 ? 1 * playSpeed : 0;
    const nextTime = Number(map!.mapData[nextCount]["time"]) - seekBuffer;

    const newLineSelectIndex = map!.typingLineNumbers.indexOf(nextCount) + 1;

    setLineSelectIndex(newLineSelectIndex);
    if (typeTicker.started) {
      typeTicker.stop();
    }

    const newCount = getSeekLineCount(nextTime);
    statusRef.current!.status.count = newCount;
    updateLine(newCount);

    playerRef.current.seekTo(nextTime);
    setNotify(Symbol(`▷`));
    drawerSelectColorChange(newLineSelectIndex);
  };

  const moveSetLine = () => {
    const lineSelectIndex = typeAtomStore.get(lineSelectIndexAtom);

    if (!lineSelectIndex) {
      return;
    }

    const seekCount = map!.typingLineNumbers[lineSelectIndex - 1];
    const playSpeed = typeAtomStore.get(speedAtom).playSpeed;
    const seekBuffer = scene === "practice" ? 1 * playSpeed : 0;
    const seekTime = Number(map!.mapData[seekCount]["time"]) - seekBuffer;

    drawerSelectColorChange(seekCount);
    playerRef.current.seekTo(seekTime);
    const newCount = getSeekLineCount(seekTime);
    statusRef.current!.status.count = newCount;
    updateLine(newCount);
    typeTicker.stop();
  };

  const drawerSelectColorChange = (newLineSelectIndex: number) => {
    for (let i = 1; i < cardRefs.current!.length; i++) {
      if (newLineSelectIndex === i) {
        cardRefs.current![i].style.outline = `3px solid ${theme.colors.semantic.word.correct}`;
      } else {
        cardRefs.current![i].style.outline = ``;
      }
    }
  };

  return { movePrevLine, moveNextLine, moveSetLine };
};
