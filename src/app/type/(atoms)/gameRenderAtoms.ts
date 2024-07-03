import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { Word } from "../components/(typing-area)/scene/child/PlayingCenter";
import { Status } from "./type";

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

// PlayingTop
export const comboAtom = atom<number>(0);

export const statusAtom = atom<Status>({
  Score: 0,
  point: 0,
  typeCount: 0,
  missCount: 0,
  lostCount: 0,
  comboCount: 0,
  missComboCount: 0,
  rank: 0,
  kpm: 0,
  lineCompleteCount: 0,
  lineFailureCount: 0,
});

export const playingNotifyAtom = atom<string>("");
export const lineKpmNotifyAtom = atom<number>(0);
export const playingRemainTimeAtom = atom<number>(0);
export const skipGuideAtom = atom<string>("");
