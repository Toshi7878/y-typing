import { LineResultObj } from "../components/(typing-area)/scene/Playing";

export type InputModeType = "roma" | "kana" | "flick";
export type SceneType = "ready" | "playing" | "end";
export interface PlayingRef {
  retry: () => void;
  pressSkip: () => void;
  realtimeSpeedChange: () => void;
  gamePause: () => void;
}

export interface WordType {
  correct: { k: string; r: string };
  nextChar: { k: string; r: string[]; p: number };
  word: { k: string; r: string[]; p: number }[];
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
  lost: number;
  rank: number;
  kpm: number;
  line: number;
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
  playSpeed: number;
  realtimeSpeed: number;
}
