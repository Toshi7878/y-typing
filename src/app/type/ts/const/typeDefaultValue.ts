import { GameStateRef, PlayMode, StatusRef, UserTypingOptions, YTStateRef } from "../type";

export const DEFAULT_STATUS_REF: StatusRef = {
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

export const DEFAULT_YT_STATE_REF: YTStateRef = {
  isPaused: false,
  currentTime: 0,
  movieDuration: 0,
};
export const DEFAULT_GAME_STATE_REF: GameStateRef = {
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

export const DEFAULT_SPEED = {
  defaultSpeed: 1,
  playSpeed: 1,
};

export const DEFAULT_USER_OPTIONS: UserTypingOptions = {
  timeOffset: 0,
  typeSound: false,
  missSound: false,
  lineClearSound: false,
  nextDisplay: "lyrics",
  timeOffsetKey: "left-right",
  toggleInputModeKey: false,
};

export const CHANGE_TIME_OFFSET_VALUE = 0.05;
