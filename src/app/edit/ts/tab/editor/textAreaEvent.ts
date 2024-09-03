import { LineEdit } from "@/types";
import { Dispatch } from "react";
import { LineInputReducerAction as LineInputReducer } from "../../type";
export class TextAreaEvents {
  static undoTopLyrics(
    lineInputReducer: Dispatch<LineInputReducer>,
    setLyricsText: Dispatch<string>,
    undoLine: LineEdit,
    addLyrics: string,
  ) {
    const lyrics = undoLine.lyrics;
    const word = undoLine.word;

    const lines = addLyrics?.split("\n") || [];
    lines.unshift(lyrics);
    const newText = lines.join("\n");
    setLyricsText(newText);

    lineInputReducer({ type: "set", payload: { lyrics, word } });
  }
}
