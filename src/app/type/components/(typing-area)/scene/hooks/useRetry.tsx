import { CreateMap } from "@/app/type/(ts)/scene-ts/ready/createTypingWord";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import { PlayingCenterRef } from "../playing-child/PlayingCenter";
import {
  lineResultsAtom,
  mapAtom,
  playingNotifyAtom,
  sceneAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { StatusRef } from "@/app/type/(ts)/type";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import { ticker } from "../Playing";

const useRetry = () => {
  const { playerRef, playingComboRef, tabStatusRef, statusRef, gameStateRef } = useRefs();

  const map = useAtomValue(mapAtom) as CreateMap;

  const playingCenterRef = useRef<PlayingCenterRef>(null);
  const [scene] = useAtom(sceneAtom);
  const setNotify = useSetAtom(playingNotifyAtom);

  const [, setLineResults] = useAtom(lineResultsAtom);

  const retry = () => {
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
    if (ticker.started) {
      ticker.stop();
    }
  };
  return retry;
};

export default useRetry;
