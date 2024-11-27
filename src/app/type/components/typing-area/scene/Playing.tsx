import PlayingCenter from "./playing-child/PlayingCenter";
import { useEffect } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import {
  useSceneAtom,
  useSetLineWordAtom,
  useSetLyricsAtom,
  useSetNextLyricsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";

import { typeTicker } from "@/app/type/hooks/useYoutubeEvents";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { defaultLineWord, defaultNextLyrics } from "@/app/type/ts/const/consts";
import { useHandleKeydown } from "@/app/type/hooks/playing-hooks/keydown-hooks/useHandleKeydown";

interface PlayingProps {
  drawerClosure: UseDisclosureReturn;
}
const Playing = ({ drawerClosure }: PlayingProps) => {
  const { onOpen } = drawerClosure;
  const { lineProgressRef, totalProgressRef } = useRefs();

  const scene = useSceneAtom();
  const setLineWord = useSetLineWordAtom();
  const setLyrics = useSetLyricsAtom();
  const setNextLyrics = useSetNextLyricsAtom();

  useEffect(() => {
    if (!typeTicker.started) {
      typeTicker.start();
    }

    if (scene === "practice") {
      onOpen();
    }

    const totalProgress = totalProgressRef.current;
    const lineProgress = lineProgressRef.current;

    return () => {
      if (typeTicker.started) {
        typeTicker.stop();
      }

      setLineWord(structuredClone(defaultLineWord));
      setLyrics("");
      setNextLyrics(structuredClone(defaultNextLyrics));
      if (totalProgress) totalProgress.value = 0;
      if (lineProgress) lineProgress.value = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PlayingCenter flex="1" />;
};

export default Playing;
