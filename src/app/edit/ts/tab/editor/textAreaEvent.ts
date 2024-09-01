import { LineEdit } from "@/types";
import { Dispatch } from "react";
import { LineInputReducerAction as LineInputReducer } from "../../type";
export class TextAreaEvents {
  static async paste(setTopLyricsText: (newText: string) => void) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollTop = 0;
        document.activeElement.blur();
      }
    });
    const newText = await navigator.clipboard.readText();
    const lines = newText.split("\n") || [];

    setTopLyricsText(lines[0]);
  }

  static deleteTopLyrics(
    setLyricsText: Dispatch<string>,
    lyrics: string,
    addLyrics: string,
    setTopLyricsText: Dispatch<string>,
  ) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    const newLines = newText?.split("\n") || [""];

    if (lyrics === topLine) {
      setLyricsText(newText);
    }

    setTopLyricsText(newLines[0]);
  }

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
