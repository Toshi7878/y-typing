import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { InputModeType, LineResultData, SceneType, Speed } from "../(ts)/type";

export const mapAtom = atom<CreateMap | null>(null);

export const sceneAtom = atom<SceneType>("ready");
export const tabIndexAtom = atom<0 | 1>(1);

const inputMode = (localStorage.getItem("inputMode") as InputModeType) || "roma";

export const inputModeAtom = atom<InputModeType>(inputMode);

export const loadingOverlayAtom = atom<boolean>(false);

export const playingNotifyAtom = atom<symbol>(Symbol(""));
export const mapIdAtom = atom<number>(0);
export const rankingScoresAtom = atom<number[]>([]);
export const kpmAtom = atom<number>(0);

export const lineResultsAtom = atom<LineResultData[]>([]);

export const isHoverDrawerLabelAtom = atom<boolean>(false);

export const lineSelectIndexAtom = atom<number | null>(null);
export const speedAtom = atom<Speed>({
  defaultSpeed: 1,
  playSpeed: 1,
});
