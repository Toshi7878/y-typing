export type InputModeType = "roma" | "kana" | "flick";
export type PlayMode = "playing" | "replay" | "practice";
export type SceneType = "ready" | "playing" | "end" | "replay" | "practice";

export type MapData = {
  time: string;
  lyrics: string;
  word: string;
  options?: { eternalCSS?: string; changeCSS?: string };
}[];
export type TypeChank = { k: string; r: string[]; p: number };

export type SpeedDifficulty = { median: { r: number; k: number }; max: { r: number; k: number } };

export interface LineData {
  time: number; //後でここは配列に変更する;
  word: TypeChank[];
  lyrics: string; //後でここは配列に変更する;
  kpm: { k: number; r: number };
  notes: { k: number; r: number };
  lineCount?: number;
  kanaWord: string;
  options?: MapData["options"];
}

export interface RankingListType {
  userId: string;
  user: { name: string };
  status: {
    romaType: number;
    kanaType: number;
    flickType: number;
    kpm: number;
    rkpm: number;
    miss: number;
    lost: number;
    maxCombo: number;
    playSpeed: number;
    defaultSpeed: number;
  };
  score: number;
  updatedAt: string;
}
export interface PlayingRef {
  retry: () => void;
  pressSkip: () => void;
  realtimeSpeedChange: () => void;
  gamePause: () => void;
  setRealTimeSpeed: (speed: number) => void;
  inputModeChange: (inputMode: InputModeType) => void;
  openLineList: () => void;
  prevLine: () => void;
  nextLine: () => void;
  practiceSetLine: () => void;
}

export interface WordType {
  correct: { k: string; r: string };
  nextChar: TypeChank;
  word: TypeChank[];
  kanaDakuten?: string;
  lineCount: number;
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
  retryCount: number;
  isSeekedLine: boolean;
  replay: {
    replayKeyCount: number;
    userName: string;
  };
  practice: {
    hasMyRankingData: boolean;
    isPracticeMode: boolean;
  };
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
  };
  lineStatus: {
    lineType: number;
    lineMiss: number;
    lineClearTime: number;
    latency: number;
    typeResult: TypeResult[];
    lineStartSpeed: number;
    lineStartInputMode: InputModeType;
  };
}

export interface YTStateRef {
  isPaused: boolean;
  currentTime: number;
  movieEndTime: number;
}

export interface SendResultData {
  mapId: number;
  lineResult: LineResultData[];
  status: {
    kanaType: number;
    romaType: number;
    flickType: number;
    miss: number;
    lost: number;
    rkpm: number;
    maxCombo: number;
    kpm: number;
    defaultSpeed: number;
  };
  score: number;
}
export interface TypeResult {
  is?: boolean;
  c?: string;
  op?: string;
  t: number;
}

export interface LineResultData {
  status?: {
    p?: number;
    tBonus?: number;
    lType?: number;
    lMiss?: number;
    lRkpm?: number;
    lKpm?: number;
    lostW?: string | null;
    lLost?: number;
    combo: number;
    tTime: number;
    mode: InputModeType;
    sp: number;
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
