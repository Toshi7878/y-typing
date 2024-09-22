import { defaultStatusRef } from "../../ts/const/typeDefaultValue";
import { StatusRef } from "../../ts/type";
import { typeTicker } from "../../ts/youtubeEvents";
import {
  useMapAtom,
  useSceneAtom,
  useSetLineResultsAtom,
  useSetPlayingNotifyAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";

export const useRetry = () => {
  const { playingCenterRef, tabStatusRef, playingComboRef, statusRef, gameStateRef, playerRef } =
    useRefs();
  const scene = useSceneAtom();
  const map = useMapAtom();
  const setLineResults = useSetLineResultsAtom();
  const setNotify = useSetPlayingNotifyAtom();

  return () => {
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
    if (typeTicker.started) {
      typeTicker.stop();
    }
  };
};
