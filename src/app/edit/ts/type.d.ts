import { Dispatch } from "react";

export type SetTagsType = "set" | "add" | "delete" | "reset";
export interface EditorSendData {
  title: string;
  creatorComment: string;
  tags: string[];
  mapData: Line[];
  videoId: string;
  previewTime: string;
  romaKpmMedian: number;
  romaKpmMax: number;
  kanaKpmMedian: number;
  kanaKpmMax: number;
  totalTime: number;
  romaTotalNotes: number;
  kanaTotalNotes: number;
  thumbnailQuality: "maxresdefault" | "mqdefault";
}

export interface TimeInputRef {
  clearTime: () => void;
  getTime: () => number;
  selectedTime: () => void;
  undoAdd: (time: Line["time"]) => void;
}

export interface EditorSettingsRef {
  getTimeOffset: () => number;
  getWordConvertOption: () => string;
  getVolume: () => number;
}
export type EditTabIndex = 0 | 1 | 2;

export interface SetLineFunctions {
  setLyrics: Dispatch<string>;
  setWord: Dispatch<string>;
  setLyricsText: Dispatch<string>;
}

export interface EditorTabRef {
  undoAddLyrics: (undoLine: Line) => void;
  setAddLyrics: () => void;
  redoAddLyrics: (redoLine: Line) => void;
  lineInit: () => void;
  getVolume: () => number | null;
}
export interface EditorButtonsRef {
  add: () => void;
  update: () => void;
  delete: () => void;
}

export interface EditSettingsRef {
  getTimeOffset: () => number;
  getWordConvertOption: () => string;
  getVolume: () => number;
}

export interface EditorTimeInputRef {
  clearTime: () => void;
  getTime: () => number;
  selectedTime: () => void;
  undoAdd: (time: Line["time"]) => void;
}
