import { LineResultObj } from "../components/(typing-area)/scene/Playing";

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
  lineTypePoint: number;
  lineMissPoint: number;
  acc: number;
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
    type: number;
    miss: number;
    lost: number;
    maxCombo: number;
    kpm: number;
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
  };
  typeResult: TypeResult[];
}
