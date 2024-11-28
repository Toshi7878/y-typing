import { useStore } from "jotai";
import { defaultLineWord, defaultNextLyrics } from "../../ts/const/consts";
import { DEFAULT_STATUS_REF } from "../../ts/const/typeDefaultValue";
import { CreateMap } from "../../ts/scene-ts/ready/createTypingWord";
import { StatusRef } from "../../ts/type";
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
  useSetStatusAtoms,
  useStatusAtomsValues,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { typeTicker } from "../useYoutubeEvents";

export const useRetry = () => {
  const { statusRef, gameStateRef, playerRef } = useRefs();
  const map = useMapAtom();
  const typeAtomStore = useStore();

  const setLineResults = useSetLineResultsAtom();
  const setCombo = useSetComboAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const setLyrics = useSetLyricsAtom();
  const setNextLyrics = useSetNextLyricsAtom();
  const setLineWord = useSetLineWordAtom();

  const { resetStatusValues } = useSetStatusAtoms();
  const statusAtomsValues = useStatusAtomsValues();

  return () => {
    setLineWord(structuredClone(defaultLineWord));
    setLyrics("");
    setNextLyrics(structuredClone(defaultNextLyrics));

    resetStatusValues();
    setCombo(0);
    (statusRef.current as StatusRef) = structuredClone(DEFAULT_STATUS_REF);

    const scene = typeAtomStore.get(sceneAtom);
    if (scene !== "replay") {
      setLineResults(structuredClone(map!.defaultLineResultData));
    }

    if (scene === "playing") {
      const status = statusAtomsValues();
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
  const { statusRef, gameStateRef, playerRef } = useRefs();
  const setCombo = useSetComboAtom();

  const map = useMapAtom() as CreateMap;
  const setLineResults = useSetLineResultsAtom();
  const setScene = useSetSceneAtom();
  const { resetStatusValues } = useSetStatusAtoms();

  return (playMode: "playing" | "replay" | "practice") => {
    setScene(playMode);

    if (playMode === "playing") {
      setLineResults(structuredClone(map.defaultLineResultData));
    }

    resetStatusValues();
    setCombo(0);
    gameStateRef.current!.replay.replayKeyCount = 0;
    (statusRef.current as StatusRef) = structuredClone(DEFAULT_STATUS_REF);
    gameStateRef.current!.isRetrySkip = true;

    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
  };
};
