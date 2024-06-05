import { UseFormSetValue } from "react-hook-form";
import { ButtonEvents } from "./buttonEvent";
export class TextAreaEvents {
  static async paste(setValue: UseFormSetValue<any>) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollTop = 0;
        document.activeElement.blur();
      }
    });
    const text = await navigator.clipboard.readText();
    TextAreaEvents.setTopLyrics(setValue, text);
  }

  static setTopLyrics(setValue: UseFormSetValue<any>, addLyrics: string) {
    const lines = addLyrics.split("\n");
    const lyrics = lines[0].replace(/\r$/, "");
    setValue("EditorTab.lyrics", lyrics);
    ButtonEvents.lyricsConvert(lyrics, setValue);
  }

  static deleteTopLyrics(setValue: UseFormSetValue<any>, lyrics: string, addLyrics: string) {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];

    const newText = lines.slice(1).join("\n");
    if (lyrics === topLine) {
      setValue("EditorTab.addLyrics", newText);
    }
    TextAreaEvents.setTopLyrics(setValue, newText);
  }
}
