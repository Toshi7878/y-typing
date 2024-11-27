import { DEFAULT_STATUS_REF } from "../../ts/const/typeDefaultValue";
import { StatusRef } from "../../ts/type";
import { typeTicker } from "../useYoutubeEvents";
import {
  sceneAtom,
  useMapAtom,
  useSetComboAtom,
  useSetLineResultsAtom,
  useSetLineWordAtom,
  useSetLyricsAtom,
  useSetNextLyricsAtom,
  useSetPlayingNotifyAtom,
  useSetSceneAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { CreateMap } from "../../ts/scene-ts/ready/createTypingWord";
import { defaultLineWord, defaultNextLyrics } from "../../ts/const/consts";
import { useStore } from "jotai";

export const useRetry = () => {
  const { tabStatusRef, statusRef, gameStateRef, playerRef } = useRefs();
  const map = useMapAtom();
  const typeAtomStore = useStore();

  const setLineResults = useSetLineResultsAtom();
  const setCombo = useSetComboAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const setLyrics = useSetLyricsAtom();
  const setNextLyrics = useSetNextLyricsAtom();
  const setLineWord = useSetLineWordAtom();

  return () => {
    setLineWord(structuredClone(defaultLineWord));
    setLyrics("");
    setNextLyrics(structuredClone(defaultNextLyrics));

    tabStatusRef.current!.resetStatus();
    setCombo(0);
    (statusRef.current as StatusRef) = structuredClone(DEFAULT_STATUS_REF);

    const scene = typeAtomStore.get(sceneAtom);
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

    gameStateRef.current!.replay.replayKeyCount = 0;

    gameStateRef.current!.isRetrySkip = true;
    playerRef.current.seekTo(0);
    if (typeTicker.started) {
      typeTicker.stop();
    }
  };
};

export const useProceedRetry = () => {
  const { statusRef, tabStatusRef, gameStateRef, playerRef } = useRefs();
  const setCombo = useSetComboAtom();

  const map = useMapAtom() as CreateMap;
  const setLineResults = useSetLineResultsAtom();
  const setScene = useSetSceneAtom();

  return (playMode: "playing" | "replay" | "practice") => {
    setScene(playMode);

    if (playMode === "playing") {
      setLineResults(structuredClone(map.defaultLineResultData));
    }

    tabStatusRef.current.resetStatus();
    setCombo(0);
    gameStateRef.current!.replay.replayKeyCount = 0;
    (statusRef.current as StatusRef) = structuredClone(DEFAULT_STATUS_REF);
    gameStateRef.current!.isRetrySkip = true;

    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
  };
};
