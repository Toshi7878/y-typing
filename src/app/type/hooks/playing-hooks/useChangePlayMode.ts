import {
  useSceneAtom,
  useSetPlayingNotifyAtom,
  useSetSceneAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { defaultGameStateRef } from "../../ts/const/typeDefaultValue";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useRetry } from "./useRetry";

export const useChangePlayMode = () => {
  const { gameStateRef } = useRefs();

  const scene = useSceneAtom();

  const setScene = useSetSceneAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const retry = useRetry();

  return (drawerClosure: UseDisclosureReturn) => {
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
        drawerClosure.onClose();
        retry();
        setNotify(Symbol(""));
      }
    }
  };
};
