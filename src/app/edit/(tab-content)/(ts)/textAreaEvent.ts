import { UseFormSetValue } from "react-hook-form";
import { ButtonEvents } from "./buttonEvent";
import { Dispatch } from "@reduxjs/toolkit";
import { setIsLoadingWordConvertBtn } from "../../(redux)/buttonLoadSlice";
export class TextAreaEvents {
  static async paste(setValue: UseFormSetValue<any>, dispatch: Dispatch) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollTop = 0;
        document.activeElement.blur();
      }
    });
    const text = await navigator.clipboard.readText();
    TextAreaEvents.setTopLyrics(setValue, text, dispatch);
  }

  static async setTopLyrics(setValue: UseFormSetValue<any>, addLyrics: string, dispatch: Dispatch) {
    const lines = addLyrics.split("\n");
    const lyrics = lines[0].replace(/\r$/, "");
    setValue("lyrics", lyrics);
    dispatch(setIsLoadingWordConvertBtn(true));
    await ButtonEvents.lyricsConvert(lyrics, setValue);
    dispatch(setIsLoadingWordConvertBtn(false));
  }

  static deleteTopLyrics(setValue: UseFormSetValue<any>, lyrics: string, addLyrics: string, dispatch: Dispatch) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    if (lyrics === topLine) {
      setValue("addLyrics", newText);
    }
    TextAreaEvents.setTopLyrics(setValue, newText, dispatch);
  }
}
