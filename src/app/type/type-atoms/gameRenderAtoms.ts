import { atom, useAtomValue, useSetAtom } from "jotai";
import { CreateMap } from "../ts/scene-ts/ready/createTypingWord";
import {
  InputModeType,
  LineResultData,
  NextLyricsType,
  SceneType,
  Speed,
  UserTypingOptions,
  WordType,
} from "../ts/type";
import { DEFAULT_SPEED, DEFAULT_USER_OPTIONS } from "../ts/const/typeDefaultValue";
import { getTypeAtomStore } from "../[id]/TypeProvider";
import { defaultLineWord } from "../ts/const/consts";
import { atomWithReset, atomWithStorage } from "jotai/utils";
const typeAtomStore = getTypeAtomStore();

const mapAtom = atomWithReset<CreateMap | null>(null);

export const useMapAtom = () => {
  return useAtomValue(mapAtom);
};

export const useSetMapAtom = () => {
  return useSetAtom(mapAtom);
};

export const sceneAtom = atomWithReset<SceneType>("ready");

export const useSceneAtom = () => {
  return useAtomValue(sceneAtom, { store: typeAtomStore });
};

export const useSetSceneAtom = () => {
  return useSetAtom(sceneAtom, { store: typeAtomStore });
};

export const hasLocalLikeAtom = atom<boolean>(false);

export const useHasLocalLikeAtom = () => {
  return useAtomValue(hasLocalLikeAtom, { store: typeAtomStore });
};

export const useSetHasLocalLikeAtom = () => {
  return useSetAtom(hasLocalLikeAtom, { store: typeAtomStore });
};

const tabIndexAtom = atomWithReset<0 | 1>(1);

export const useTabIndexAtom = () => {
  return useAtomValue(tabIndexAtom);
};

export const useSetTabIndexAtom = () => {
  return useSetAtom(tabIndexAtom);
};

export const inputModeAtom = atomWithStorage<InputModeType>("inputMode", "roma");

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

const playingNotifyAtom = atomWithReset<symbol>(Symbol(""));

export const usePlayingNotifyAtom = () => {
  return useAtomValue(playingNotifyAtom);
};

export const useSetPlayingNotifyAtom = () => {
  return useSetAtom(playingNotifyAtom);
};

export const rankingScoresAtom = atom<number[]>([]);
export const useRankingScoresAtom = () => {
  return useAtomValue(rankingScoresAtom);
};

export const useSetRankingScoresAtom = () => {
  return useSetAtom(rankingScoresAtom);
};

export const lineResultsAtom = atom<LineResultData[]>([]);

export const useLineResultsAtom = () => {
  return useAtomValue(lineResultsAtom, { store: typeAtomStore });
};

export const useSetLineResultsAtom = () => {
  return useSetAtom(lineResultsAtom, { store: typeAtomStore });
};

const lineSelectIndexAtom = atom<number | null>(null);

export const useLineSelectIndexAtom = () => {
  return useAtomValue(lineSelectIndexAtom);
};

export const useSetLineSelectIndexAtom = () => {
  return useSetAtom(lineSelectIndexAtom);
};

export const speedAtom = atom<Speed>(DEFAULT_SPEED);

export const useTypePageSpeedAtom = () => {
  return useAtomValue(speedAtom, { store: typeAtomStore });
};

export const useSetTypePageSpeedAtom = () => {
  return useSetAtom(speedAtom, { store: typeAtomStore });
};

export const userOptionsAtom = atom<UserTypingOptions>(DEFAULT_USER_OPTIONS);

export const useUserOptionsAtom = () => {
  return useAtomValue(userOptionsAtom, { store: typeAtomStore });
};

export const useSetUserOptionsAtom = () => {
  return useSetAtom(userOptionsAtom, { store: typeAtomStore });
};

export const timeOffsetAtom = atom<number>(0);

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

export const lineWordAtom = atom<WordType>(structuredClone(defaultLineWord));

export const useLineWordAtom = () => {
  return useAtomValue(lineWordAtom, { store: typeAtomStore });
};

export const useSetLineWordAtom = () => {
  return useSetAtom(lineWordAtom, { store: typeAtomStore });
};

export const skipAtom = atom<"Space" | "">("");

export const useSkipAtom = () => {
  return useAtomValue(skipAtom, { store: typeAtomStore });
};

export const useSetSkipAtom = () => {
  return useSetAtom(skipAtom, { store: typeAtomStore });
};

export const currentTimeSSMMAtom = atom(0);

export const useCurrentTimeSSMMAtom = () => {
  return useAtomValue(currentTimeSSMMAtom, { store: typeAtomStore });
};

export const useSetCurrentTimeSSMMAtom = () => {
  return useSetAtom(currentTimeSSMMAtom, { store: typeAtomStore });
};

const displayLineRemainTimeAtom = atom(0);

export const useDisplayLineRemainTimeAtom = () => {
  return useAtomValue(displayLineRemainTimeAtom, { store: typeAtomStore });
};

export const useSetDisplayLineRemainTimeAtom = () => {
  return useSetAtom(displayLineRemainTimeAtom, { store: typeAtomStore });
};
const displayLineKpmAtom = atom(0);

export const useDisplayLineKpmAtom = () => {
  return useAtomValue(displayLineKpmAtom, { store: typeAtomStore });
};

export const useSetDisplayLineKpmAtom = () => {
  return useSetAtom(displayLineKpmAtom, { store: typeAtomStore });
};

export const comboAtom = atom(0);

export const useComboAtom = () => {
  return useAtomValue(comboAtom, { store: typeAtomStore });
};

export const useSetComboAtom = () => {
  return useSetAtom(comboAtom, { store: typeAtomStore });
};
