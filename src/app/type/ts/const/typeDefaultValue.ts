import { GameStateRef, PlayMode, StatusRef, YTStateRef } from "../type";

export const defaultStatusRef: StatusRef = {
  status: {
    count: 0,
    romaType: 0,
    kanaType: 0,
    flickType: 0,
    rkpm: 0,
    clearRate: 100,
    kanaToRomaConvertCount: 0,
    maxCombo: 0,
    missCombo: 0,
    totalTypeTime: 0,
    totalLatency: 0,
    completeCount: 0,
    failureCount: 0,
  },
  lineStatus: {
    lineType: 0,
    lineMiss: 0,
    lineClearTime: 0,
    latency: 0,
    typeResult: [],
    lineStartSpeed: 1,
    lineStartInputMode: "roma",
  },
};

export const defaultYTStateRef: YTStateRef = {
  isPaused: false,
  currentTime: 0,
  movieDuration: 0,
};
export const defaultGameStateRef: GameStateRef = {
  isRetrySkip: false,
  retryCount: 1,
  isSeekedLine: false,
  playMode: "playing" as PlayMode,
  replay: {
    replayKeyCount: 0,
    userName: "",
  },
  practice: {
    hasMyRankingData: false,
  },
};

export const defaultSpeed = {
  defaultSpeed: 1,
  playSpeed: 1,
};
