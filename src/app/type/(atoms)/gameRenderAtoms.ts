import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { InputModeType, SceneType, Speed } from "../(ts)/type";

export const mapAtom = atom<CreateMap | null>(null);

export const sceneAtom = atom<SceneType>("ready");
export const tabIndexAtom = atom<0 | 1>(1);

const inputMode = (localStorage.getItem("inputMode") as InputModeType) || "roma";

export const inputModeAtom = atom<InputModeType>(inputMode);

export const playingNotifyAtom = atom<symbol>(Symbol(""));
export const mapIdAtom = atom<number>(0);
export const rankingScoresAtom = atom<number[]>([]);
export const kpmAtom = atom<number>(0);

export const lineSelectIndexAtom = atom<number>(1);
export const speedAtom = atom<Speed>({
  defaultSpeed: 1,
  playSpeed: 1,
});
