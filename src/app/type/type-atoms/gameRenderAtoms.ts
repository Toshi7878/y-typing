import { atom, useAtomValue, useSetAtom } from "jotai";
import { CreateMap } from "../ts/scene-ts/ready/createTypingWord";
import { InputModeType, LineResultData, SceneType, Speed } from "../ts/type";

export const mapAtom = atom<CreateMap | null>(null);

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

export const rankingScoresAtom = atom<number[]>([]);
export const kpmAtom = atom<number>(0);

export const lineResultsAtom = atom<LineResultData[]>([]);

export const isHoverDrawerLabelAtom = atom<boolean>(false);

export const lineSelectIndexAtom = atom<number | null>(null);
export const speedAtom = atom<Speed>({
  defaultSpeed: 1,
  playSpeed: 1,
});
