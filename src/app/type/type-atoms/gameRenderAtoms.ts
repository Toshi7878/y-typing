import { atom, useAtomValue, useSetAtom } from "jotai";
import { CreateMap } from "../ts/scene-ts/ready/createTypingWord";
import { InputModeType, LineResultData, SceneType, Speed } from "../ts/type";
import { defaultSpeed } from "../ts/const/typeDefaultValue";

const mapAtom = atom<CreateMap | null>(null);

export const useMapAtom = () => {
  return useAtomValue(mapAtom);
};

export const useSetMapAtom = () => {
  return useSetAtom(mapAtom);
};

const sceneAtom = atom<SceneType>("ready");

export const useSceneAtom = () => {
  return useAtomValue(sceneAtom);
};

export const useSetSceneAtom = () => {
  return useSetAtom(sceneAtom);
};

const tabIndexAtom = atom<0 | 1>(1);

export const useTabIndexAtom = () => {
  return useAtomValue(tabIndexAtom);
};

export const useSetTabIndexAtom = () => {
  return useSetAtom(tabIndexAtom);
};

const inputMode = (localStorage.getItem("inputMode") as InputModeType) || "roma";

const inputModeAtom = atom<InputModeType>(inputMode);

export const useInputModeAtom = () => {
  return useAtomValue(inputModeAtom);
};

export const useSetInputModeAtom = () => {
  return useSetAtom(inputModeAtom);
};

const isLoadingOverlayAtom = atom<boolean>(false);

export const useIsLoadingOverlayAtom = () => {
  return useAtomValue(isLoadingOverlayAtom);
};

export const useSetIsLoadingOverlayAtom = () => {
  return useSetAtom(isLoadingOverlayAtom);
};

const playingNotifyAtom = atom<symbol>(Symbol(""));

export const usePlayingNotifyAtom = () => {
  return useAtomValue(playingNotifyAtom);
};

export const useSetPlayingNotifyAtom = () => {
  return useSetAtom(playingNotifyAtom);
};

const mapIdAtom = atom<number>(0);

export const useMapIdAtom = () => {
  return useAtomValue(mapIdAtom);
};

export const useSetMapIdAtom = () => {
  return useSetAtom(mapIdAtom);
};

const rankingScoresAtom = atom<number[]>([]);
export const useRankingScoresAtom = () => {
  return useAtomValue(rankingScoresAtom);
};

export const useSetRankingScoresAtom = () => {
  return useSetAtom(rankingScoresAtom);
};

const lineResultsAtom = atom<LineResultData[]>([]);

export const useLineResultsAtom = () => {
  return useAtomValue(lineResultsAtom);
};

export const useSetLineResultsAtom = () => {
  return useSetAtom(lineResultsAtom);
};

const lineSelectIndexAtom = atom<number | null>(null);

export const useLineSelectIndexAtom = () => {
  return useAtomValue(lineSelectIndexAtom);
};

export const useSetLineSelectIndexAtom = () => {
  return useSetAtom(lineSelectIndexAtom);
};

const speedAtom = atom<Speed>(defaultSpeed);

export const useTypePageSpeedAtom = () => {
  return useAtomValue(speedAtom);
};

export const useSetTypePageSpeedAtom = () => {
  return useSetAtom(speedAtom);
};
