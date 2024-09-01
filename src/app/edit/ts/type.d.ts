import { LineInput } from "@/types";
import { Dispatch } from "react";

export type TagsReducerActionType = "set" | "add" | "delete" | "reset";
export type LineInputReducerActionType = "set" | "reset";

export type ConvertOptionsType = "non_symbol" | "add_symbol" | "add_symbol_all";
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

export type EditTabIndex = 0 | 1 | 2;

export interface EditorTabRef {
  undoAddLyrics: (undoLine: Line) => void;
  redoAddLyrics: (redoLine: Line) => void;
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
  selectedTime: (count: number | null) => void;
  undoAdd: (time: Line["time"]) => void;
}

export type LineInputReducerAction = { type: LineInputReducerActionType; payload?: LineInput };
