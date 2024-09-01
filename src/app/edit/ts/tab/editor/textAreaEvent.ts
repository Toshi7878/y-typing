import { ButtonEvents } from "./buttonEvent";
import { LineEdit } from "@/types";
import { Dispatch } from "react";
import { LineInputReducerAction as LineInputReducer } from "../../type";
export class TextAreaEvents {
  static async paste(
    lineInputReducer: Dispatch<LineInputReducer>,
    setIsLoadWordConvert: Dispatch<boolean>,
    convertOption: string,
  ) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollTop = 0;
        document.activeElement.blur();
      }
    });
    const text = await navigator.clipboard.readText();
    TextAreaEvents.setTopLyrics(lineInputReducer, text, setIsLoadWordConvert, convertOption);
  }

  static async setTopLyrics(
    lineInputReducer: Dispatch<LineInputReducer>,
    addLyrics: string,
    setIsLoadWordConvert: Dispatch<boolean>,
    convertOption: string,
  ) {
    const lines = addLyrics.split("\n");
    const lyrics = lines[0].replace(/\r$/, "");

    setIsLoadWordConvert(true);
    const word = await ButtonEvents.lyricsConvert(lyrics, convertOption);
    setIsLoadWordConvert(false);

    lineInputReducer({ type: "set", payload: { lyrics, word } });
  }

  static deleteTopLyrics(
    lineInputReducer: Dispatch<LineInputReducer>,
    setLyricsText: Dispatch<string>,
    lyrics: string,
    addLyrics: string,
    setIsLoadWordConvert: Dispatch<boolean>,
    convertOption: string,
  ) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    if (lyrics === topLine) {
      setLyricsText(newText);
    }
    TextAreaEvents.setTopLyrics(lineInputReducer, newText, setIsLoadWordConvert, convertOption);
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
