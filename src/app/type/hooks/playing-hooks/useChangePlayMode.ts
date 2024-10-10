import {
  useSceneAtom,
  useSetPlayingNotifyAtom,
  useSetSceneAtom,
  useSetTypePageSpeedAtom,
  useTypePageSpeedAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { defaultGameStateRef, defaultSpeed } from "../../ts/const/typeDefaultValue";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useRetry } from "./useRetry";
import { YTSpeedController } from "../../ts/ytHandleEvents";

export const useChangePlayMode = () => {
  const { gameStateRef, playerRef } = useRefs();

  const scene = useSceneAtom();

  const setScene = useSetSceneAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const retry = useRetry();
  const speedData = useTypePageSpeedAtom();
  const setSpeedData = useSetTypePageSpeedAtom();

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
        if (speedData.defaultSpeed < 1) {
          new YTSpeedController("setDefaultSpeed", {
            setSpeedData,
            playerRef: playerRef.current,
            speed: 1,
            defaultSpeed: 1,
          });
        }
        setSpeedData(defaultSpeed);
      }
      setNotify(Symbol(""));
    }
  };
};
