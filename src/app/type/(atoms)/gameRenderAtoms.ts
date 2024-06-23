import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { Word } from "../components/(typing-area)/scene/child/PlayingCenter";

export const mapAtom = atom<CreateMap | null>(null);

export const lineWordAtom = atom<Word>({
  correct: { k: "", r: "" },
  nextChar: { k: "", r: [""] },
  word: [{ k: "", r: [""] }],
});
export const lyricsAtom = atom<string>("");
export const nextLyricsAtom = atom<string>("");
export const sceneAtom = atom<"ready" | "playing" | "end">("ready");

// PlayingTop
export const comboAtom = atom<number>(0);
export const playingNotifyAtom = atom<string>("");
export const lineKpmNotify = atom<number>(0);
export const playingRemainTime = atom<number>(0);
