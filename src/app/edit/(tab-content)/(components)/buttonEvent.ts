import { Dispatch } from "react";
import { addLine, deleteLine, updateLine } from "../../(redux)/mapDataSlice";
import { InputFormSchema } from "../../InputProvider";
import { TextAreaEvents } from "./textAreaEvent";
import { WordConvert } from "./wordConvert";
import { UseFormSetValue } from "react-hook-form";

export class ButtonEvents {
  static addLine(dispatch: Dispatch<any>, line: InputFormSchema["EditorTab"]) {
    dispatch(addLine({ time: line.time, lyrics: line.lyrics, word: line.word }));
  }

  static updateLine(dispatch: Dispatch<any>, line: InputFormSchema["EditorTab"]) {
    dispatch(
      updateLine({
        time: line.time,
        lyrics: line.lyrics,
        word: line.word,
        lineNumber: line.lineNumber,
      })
    );
  }

  static async lyricsConvert(lyrics: string, setValue: UseFormSetValue<any>) {
    const wordConvert = new WordConvert();
    const word = await wordConvert.convert(lyrics, "non_symbol");
    setValue("EditorTab.word", word);
  }

  static deleteLine(dispatch: Dispatch<any>, lineNumber: string) {
    dispatch(deleteLine(lineNumber));
  }
}
