import { UseFormSetValue } from "react-hook-form";
import { ButtonEvents } from "./buttonEvent";
import { setIsLoadingWordConvertBtn } from "../../../redux/buttonFlagsSlice";
import { Line } from "@/types";
import { Dispatch } from "react";
import { Action } from "@reduxjs/toolkit";
import { SetLineFunctions } from "../../type";
export class TextAreaEvents {
  static async paste(
    setLineFunctions: SetLineFunctions,
    dispatch: Dispatch<Action>,
    convertOption: string,
  ) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollTop = 0;
        document.activeElement.blur();
      }
    });
    const text = await navigator.clipboard.readText();
    TextAreaEvents.setTopLyrics(setLineFunctions, text, dispatch, convertOption);
  }

  static async setTopLyrics(
    setLineFunctions: SetLineFunctions,
    addLyrics: string,
    dispatch: Dispatch<Action>,
    convertOption: string,
  ) {
    const lines = addLyrics.split("\n");
    const topLine = lines[0].replace(/\r$/, "");

    setLineFunctions.setLyrics(topLine);
    dispatch(setIsLoadingWordConvertBtn(true));
    await ButtonEvents.lyricsConvert(topLine, setLineFunctions, convertOption);
    dispatch(setIsLoadingWordConvertBtn(false));
  }

  static deleteTopLyrics(
    setLineFunctions: SetLineFunctions,
    lyrics: string,
    addLyrics: string,
    dispatch: Dispatch<Action>,
    convertOption: string,
  ) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    if (lyrics === topLine) {
      setLineFunctions.setLyricsText(newText);
    }
    TextAreaEvents.setTopLyrics(setLineFunctions, newText, dispatch, convertOption);
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
