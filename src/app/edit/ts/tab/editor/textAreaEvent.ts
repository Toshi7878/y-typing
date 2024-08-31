import { ButtonEvents } from "./buttonEvent";
import { Line } from "@/types";
import { Dispatch } from "react";
import { Action } from "@reduxjs/toolkit";
import { SetLineFunctions } from "../../type";
export class TextAreaEvents {
  static async paste(
    setLineFunctions: SetLineFunctions,
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
    TextAreaEvents.setTopLyrics(setLineFunctions, text, setIsLoadWordConvert, convertOption);
  }

  static async setTopLyrics(
    setLineFunctions: SetLineFunctions,
    addLyrics: string,
    setIsLoadWordConvert: Dispatch<boolean>,
    convertOption: string,
  ) {
    const lines = addLyrics.split("\n");
    const topLine = lines[0].replace(/\r$/, "");

    setLineFunctions.setLyrics(topLine);
    setIsLoadWordConvert(true);
    await ButtonEvents.lyricsConvert(topLine, setLineFunctions, convertOption);
    setIsLoadWordConvert(false);
  }

  static deleteTopLyrics(
    setLineFunctions: SetLineFunctions,
    lyrics: string,
    addLyrics: string,
    setIsLoadWordConvert: Dispatch<boolean>,
    convertOption: string,
  ) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    if (lyrics === topLine) {
      setLineFunctions.setLyricsText(newText);
    }
    TextAreaEvents.setTopLyrics(setLineFunctions, newText, setIsLoadWordConvert, convertOption);
  }

  static undoTopLyrics(setLineFunctions: SetLineFunctions, undoLine: Line, addLyrics: string) {
    const lyrics = undoLine.lyrics;
    const word = undoLine.word;

    const lines = addLyrics?.split("\n") || [];
    lines.unshift(lyrics);
    const newText = lines.join("\n");
    setLineFunctions.setLyricsText(newText);
    setLineFunctions.setLyrics(lyrics || "");
    setLineFunctions.setWord(word || "");
  }
}
