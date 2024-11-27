import {
  useSceneAtom,
  useSetPlayingNotifyAtom,
  useSetSceneAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { DEFAULT_GAME_STATE_REF } from "../../ts/const/typeDefaultValue";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useRetry } from "./useRetry";
import { useVideoSpeedChange } from "../useVideoSpeedChange";

export const useChangePlayMode = () => {
  const { gameStateRef } = useRefs();

  const scene = useSceneAtom();

  const setScene = useSetSceneAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const retry = useRetry();
  const { defaultSpeedChange } = useVideoSpeedChange();

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
        gameStateRef.current!.practice = structuredClone(DEFAULT_GAME_STATE_REF.practice);
        gameStateRef.current!.replay = structuredClone(DEFAULT_GAME_STATE_REF.replay);
        gameStateRef.current!.playMode = "playing";
        setScene("playing");
        drawerClosure.onClose();
        retry();
        defaultSpeedChange("set", gameStateRef.current?.startPlaySpeed);
      }
      setNotify(Symbol(""));
    }
  };
};
