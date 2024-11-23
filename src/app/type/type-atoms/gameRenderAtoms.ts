import { atom, createStore, useAtomValue, useSetAtom } from "jotai";
import { CreateMap } from "../ts/scene-ts/ready/createTypingWord";
import {
  InputModeType,
  LineResultData,
  NextLyricsType,
  SceneType,
  Speed,
  UserTypingOptions,
} from "../ts/type";
import { DEFAULT_SPEED, DEFAULT_USER_OPTIONS } from "../ts/const/typeDefaultValue";
const typeAtomStore = createStore();

export const getTypeAtomStore = () => typeAtomStore;

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

export const hasLocalLikeAtom = atom<boolean>(false);

export const useHasLocalLikeAtom = () => {
  return useAtomValue(hasLocalLikeAtom, { store: typeAtomStore });
};

export const useSetHasLocalLikeAtom = () => {
  return useSetAtom(hasLocalLikeAtom, { store: typeAtomStore });
};

const tabIndexAtom = atom<0 | 1>(1);

export const useTabIndexAtom = () => {
  return useAtomValue(tabIndexAtom);
};

export const useSetTabIndexAtom = () => {
  return useSetAtom(tabIndexAtom);
};

export const inputModeAtom = atom<InputModeType>("roma");

export const useInputModeAtom = () => {
  return useAtomValue(inputModeAtom, { store: typeAtomStore });
};

export const useSetInputModeAtom = () => {
  return useSetAtom(inputModeAtom, { store: typeAtomStore });
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

const speedAtom = atom<Speed>(DEFAULT_SPEED);

export const useTypePageSpeedAtom = () => {
  return useAtomValue(speedAtom);
};

export const useSetTypePageSpeedAtom = () => {
  return useSetAtom(speedAtom);
};

export const userOptionsAtom = atom<UserTypingOptions>(DEFAULT_USER_OPTIONS);

export const useUserOptionsAtom = () => {
  return useAtomValue(userOptionsAtom, { store: typeAtomStore });
};

export const useSetUserOptionsAtom = () => {
  return useSetAtom(userOptionsAtom, { store: typeAtomStore });
};

const timeOffsetAtom = atom<number>(0);

export const useTimeOffsetAtom = () => {
  return useAtomValue(timeOffsetAtom, { store: typeAtomStore });
};

export const useSetTimeOffsetAtom = () => {
  return useSetAtom(timeOffsetAtom, { store: typeAtomStore });
};
const lyricsAtom = atom<string>("");

export const useLyricsAtom = () => {
  return useAtomValue(lyricsAtom, { store: typeAtomStore });
};

export const useSetLyricsAtom = () => {
  return useSetAtom(lyricsAtom, { store: typeAtomStore });
};
const nextLyricsAtom = atom<NextLyricsType>({
  lyrics: "",
  kpm: "",
});

export const useNextLyricsAtom = () => {
  return useAtomValue(nextLyricsAtom, { store: typeAtomStore });
};

export const useSetNextLyricsAtom = () => {
  return useSetAtom(nextLyricsAtom, { store: typeAtomStore });
};
