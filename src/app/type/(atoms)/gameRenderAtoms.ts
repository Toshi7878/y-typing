import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { Word } from "../components/(typing-area)/scene/child/PlayingCenter";
import { Status } from "../(ts)/type";

export const mapAtom = atom<CreateMap | null>(null);

export const lineWordAtom = atom<Word>({
  correct: { k: "", r: "" },
  nextChar: { k: "", r: [""], p: 0 },
  word: [{ k: "", r: [""], p: 0 }],
});
export const lyricsAtom = atom<string>("");
export const nextLyricsAtom = atom<{ lyrics: string; kpm: string }>({ lyrics: "", kpm: "" });
export const currentTimeSSMMAtom = atom<number>(0);

export const sceneAtom = atom<"ready" | "playing" | "end">("ready");
export const tabIndexAtom = atom<0 | 1>(1);

// PlayingTop
export const comboAtom = atom<number>(0);

export const defaultStatus = {
  display: {
    score: 0,
    point: 0,
    timeBonus: 0,
    type: 0,
    miss: 0,
    lost: 0,
    combo: 0,
    rank: 0,
    kpm: 0,
    line: 0,
  },
  lineTypePoint: 0,
  lineMissPoint: 0,
  romaType: 0,
  kanaType: 0,
  flickType: 0,
  correct: 0,
  acc: 100,
  rkpm: 0,
  maxCombo: 0,
  missCombo: 0,
  lineCompleteCount: 0,
  lineFailureCount: 0,
};
export const statusAtom = atom<Status>(defaultStatus);

export const playingNotifyAtom = atom<{ text: string }>({ text: "" });
export const lineKpmAtom = atom<number>(0);
export const remainTimeAtom = atom<string>("0.0");
export const mapIdAtom = atom<number>(0);
