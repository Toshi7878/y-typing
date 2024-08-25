import { UseFormSetValue } from "react-hook-form";
import { ButtonEvents } from "./buttonEvent";
import { Dispatch } from "@reduxjs/toolkit";
import { setIsLoadingWordConvertBtn } from "../../../redux/buttonFlagsSlice";
import { Line } from "@/types";
export class TextAreaEvents {
  static async paste(setValue: UseFormSetValue<any>, dispatch: Dispatch, convertOption: string) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollTop = 0;
        document.activeElement.blur();
      }
    });
    const text = await navigator.clipboard.readText();
    TextAreaEvents.setTopLyrics(setValue, text, dispatch, convertOption);
  }

  static async setTopLyrics(
    setValue: UseFormSetValue<any>,
    addLyrics: string,
    dispatch: Dispatch,
    convertOption: string,
  ) {
    const lines = addLyrics.split("\n");
    const lyrics = lines[0].replace(/\r$/, "");

    if (lyrics) {
      setValue("lyrics", lyrics);
      dispatch(setIsLoadingWordConvertBtn(true));
      await ButtonEvents.lyricsConvert(lyrics, setValue, convertOption);
      dispatch(setIsLoadingWordConvertBtn(false));
    }
  }

  static deleteTopLyrics(
    setValue: UseFormSetValue<any>,
    lyrics: string,
    addLyrics: string,
    dispatch: Dispatch,
    convertOption: string,
  ) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    if (lyrics === topLine) {
      setValue("addLyrics", newText);
    }
    TextAreaEvents.setTopLyrics(setValue, newText, dispatch, convertOption);
  }

  static undoTopLyrics(setValue: UseFormSetValue<any>, undoLine: Line, addLyrics: string) {
    const lyrics = undoLine.lyrics;
    const word = undoLine.word;

    const lines = addLyrics?.split("\n") || [];
    lines.unshift(lyrics);
    const newText = lines.join("\n");
    setValue("addLyrics", newText);
    setValue("lyrics", lyrics || "");
    setValue("word", word || "");
  }
}
