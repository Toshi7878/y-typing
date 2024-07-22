import { LineResultObj } from "../components/(typing-area)/scene/Playing";

export type InputModeType = "roma" | "kana" | "flick";
export type SceneType = "ready" | "playing" | "end";

export type MapData = { time: string; lyrics: string; word: string; option?: string }[];
export type TypeChank = { k: string; r: string[]; p: number };

export type SpeedDifficulty = { median: { r: number; k: number }; max: { r: number; k: number } };

export interface LineData {
  time: string; //後でここは配列に変更する;
  word: TypeChank[];
  lyrics: string; //後でここは配列に変更する;
  kpm: { k: number; r: number };
  notes: { k: number; r: number };
}

export interface RankingListType {
  userId: string;
  user: { name: string };
  status: {
    score: number;
    romaType: number;
    kanaType: number;
    flickType: number;
    kpm: number;
    rkpm: number;
    miss: number;
    lost: number;
    maxCombo: number;
    playSpeed: number;
  };
  updatedAt: string;
}
export interface PlayingRef {
  retry: () => void;
  pressSkip: () => void;
  realtimeSpeedChange: () => void;
  gamePause: () => void;
  inputModeChange: (inputMode: InputModeType) => void;
}

export interface WordType {
  correct: { k: string; r: string };
  nextChar: TypeChank;
  word: TypeChank[];
  kanaDakuten?: string;
}

export interface NextLyricsType {
  lyrics: string;
  kpm: string;
}

export interface Status {
  score: number;
  point: number;
  timeBonus: number;
  type: number;
  miss: number;
  kpm: number;
  lost: number;
  rank: number;
  line: number;
}

export interface GameStateRef {
  isRetrySkip: boolean;
}

export interface StatusRef {
  status: {
    count: number;
    romaType: number;
    kanaType: number;
    flickType: number;
    rkpm: number;
    maxCombo: number;
    missCombo: number;
    totalTypeTime: number;
    totalLatency: number;
    completeCount: number;
    failureCount: number;
    result: LineResultObj[];
  };
  lineStatus: {
    lineType: number;
    lineMiss: number;
    lineClearTime: number;
    latency: number;
    typeResult: TypeResult[];
  };
}

export interface YTStateRef {
  isPaused: boolean;
  currentTime: number;
}

export interface SendResultData {
  mapId: number;
  lineResult: LineResultObj;
  status: {
    score: number;
    kanaType: number;
    romaType: number;
    flickType: number;
    miss: number;
    lost: number;
    rkpm: number;
    maxCombo: number;
    kpm: number;
    playSpeed: number;
  };
}
export interface TypeResult {
  type?: {
    char: string;
    isSuccess: boolean;
  };
  option?: string;
  time: number;
}

export interface LineResultObj {
  status: {
    point: number;
    timeBonus: number;
    type: number;
    miss: number;
    combo: number;
    clearTime: number;
    kpm: number;
    rkpm: number;
    lineKpm: number;
  };
  typeResult: TypeResult[];
}

export interface Speed {
  defaultSpeed: number;
  playSpeed: number;
}

export type Dakuten =
  | "ゔ"
  | "が"
  | "ぎ"
  | "ぐ"
  | "げ"
  | "ご"
  | "ざ"
  | "じ"
  | "ず"
  | "ぜ"
  | "ぞ"
  | "だ"
  | "ぢ"
  | "づ"
  | "で"
  | "ど"
  | "ば"
  | "び"
  | "ぶ"
  | "べ"
  | "ぼ";

export type NormalizeHirakana =
  | "う"
  | "か"
  | "き"
  | "く"
  | "け"
  | "こ"
  | "さ"
  | "し"
  | "す"
  | "せ"
  | "そ"
  | "た"
  | "ち"
  | "つ"
  | "て"
  | "と"
  | "は"
  | "ひ"
  | "ふ"
  | "へ"
  | "ほ";

export type HanDakuten = "ぱ" | "ぴ" | "ぷ" | "ぺ" | "ぽ";
