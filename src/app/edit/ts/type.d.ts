import { LineInput, YouTubeSpeed } from "@/types";
import { Dispatch } from "react";

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
  redoAddLyrics: (redoLine: Line) => void;
}
export interface EditorButtonsRef {
  add: () => void;
  update: () => void;
  delete: () => void;
}

export interface EditorTimeInputRef {
  clearTime: () => void;
  getTime: () => number;
  selectedTime: (count: number | null) => void;
  undoAdd: (time: Line["time"]) => void;
}

type TagsReducerActionType = "set" | "add" | "delete" | "reset";
type LineInputReducerActionType = "set" | "reset";
export type YTSpeedReducerActionType = "up" | "down";
export type LineInputReducerAction = { type: LineInputReducerActionType; payload?: LineInput };
export type TagsReducerAction = { type: TagsReducerActionType; payload?: Tag | Tag[] };
