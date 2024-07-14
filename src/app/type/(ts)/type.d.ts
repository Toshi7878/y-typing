import { LineResultObj } from "../components/(typing-area)/scene/Playing";

export interface PlayingRef {
  retry: () => void;
  pressSkip: () => void;
  realtimeSpeedChange: () => void;
  gamePause: () => void;
}

export interface Status {
  display: {
    score: number;
    point: number;
    timeBonus: number;
    type: number;
    miss: number;
    lost: number;
    combo: number;
    rank: number;
    kpm: number;
    line: number;
  };

  //あとでRefで管理ようにする。
  lineTypePoint: number;
  lineMissPoint: number;
  romaType: number;
  kanaType: number;
  flickType: number;
  correct: number;
  acc: number;
  rkpm: number;
  maxCombo: number;
  missCombo: number;
  lineCompleteCount: number;
  lineFailureCount: number;
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

export interface LineStatus {
  type: number;
  miss: number;
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
