import { MapData } from "@/app/type/ts/type";
import { YouTubeSpeed } from "@/types";
import { Dispatch } from "react";

export type ConvertOptionsType = "non_symbol" | "add_symbol" | "add_symbol_all";
export interface EditorSendData {
  title: string;
  creatorComment: string;
  tags: string[];
  mapData: MapData[];
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

export interface EditorTimeInputRef {
  clearTime: () => void;
  getTime: () => number;
  setSelectedTime: (count: number | null) => void;
  setTime: (time: Line["time"]) => void;
}

type TagsReducerActionType = "set" | "add" | "delete" | "reset";
type LineInputReducerActionType = "set" | "reset";
export type YTSpeedReducerActionType = "up" | "down";
export type LineInputReducerAction = { type: LineInputReducerActionType; payload?: LineInput };
export type TagsReducerAction = { type: TagsReducerActionType; payload?: Tag | Tag[] };
