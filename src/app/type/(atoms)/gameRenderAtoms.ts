import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { Word } from "../components/(typing-area)/scene/Playing";

export const mapAtom = atom<CreateMap | null>(null);
export const mainWordAtom = atom<Word>({
  correct: { k: "", r: "" },
  nextChar: { k: "", r: [""] },
  word: [{ k: "", r: [""] }],
});
// export const subWordAtom = atom<{ correct: string; nextChar: string; word: string }>({
//   correct: "",
//   nextChar: "",
//   word: "",
// });
export const currentLineWordAtom = atom<{ k: string; r: string[] }[]>([{ k: "", r: [""] }]);
export const lyricsAtom = atom<string>("");
export const nextLyricsAtom = atom<string>("");
export const sceneAtom = atom<"ready" | "playing" | "end">("ready");
