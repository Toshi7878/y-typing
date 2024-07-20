import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { InputModeType, SceneType, Speed } from "../(ts)/type";

export const mapAtom = atom<CreateMap | null>(null);

export const sceneAtom = atom<SceneType>("ready");
export const tabIndexAtom = atom<0 | 1>(1);
export const inputModeAtom = atom<InputModeType>("roma");

export const playingNotifyAtom = atom<string>("");
export const mapIdAtom = atom<number>(0);
export const rankingScoresAtom = atom<number[]>([]);
export const kpmAtom = atom<number>(0);

export const speedAtom = atom<Speed>({
  playSpeed: 1,
  realtimeSpeed: 1,
});
