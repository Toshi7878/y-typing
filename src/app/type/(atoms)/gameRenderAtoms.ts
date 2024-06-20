import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";

export const mapAtom = atom<CreateMap | null>(null);
export const mainWordAtom = atom<{ correct: string; nextChar: string; word: string }>({
  correct: "",
  nextChar: "",
  word: "",
});
export const subWordAtom = atom<{ correct: string; nextChar: string; word: string }>({
  correct: "",
  nextChar: "",
  word: "",
});
export const lyricsAtom = atom<string>("");
export const nextLyricsAtom = atom<string>("");
export const sceneAtom = atom<"ready" | "playing" | "end">("ready");
