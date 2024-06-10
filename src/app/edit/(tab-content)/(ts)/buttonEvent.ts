import { Dispatch } from "react";
import { addLine, deleteLine, updateLine } from "../../(redux)/mapDataSlice";
import { WordConvert } from "./wordConvert";
import { UseFormSetValue } from "react-hook-form";
import { setSelectedIndex } from "../../(redux)/lineIndexSlice";
import { addHistory } from "../../(redux)/undoredoSlice";

export interface Line {
  time: string;
  lyrics: string;
  word: string;
  lineNumber?: string;
}

export class ButtonEvents {
  static addLine(dispatch: Dispatch<any>, line: Line) {
    dispatch(addLine({ time: line.time, lyrics: line.lyrics, word: line.word }));
    dispatch(addHistory({ type: "add", data: line }));
  }

  static updateLine(dispatch: Dispatch<any>, line: Line) {
    dispatch(
      updateLine({
        time: line.time,
        lyrics: line.lyrics,
        word: line.word,
        lineNumber: line.lineNumber,
      })
    );
    dispatch(setSelectedIndex(null));
  }

  static async lyricsConvert(
    lyrics: string,
    setValue: UseFormSetValue<any>,
    convertOption: string
  ) {
    const wordConvert = new WordConvert(convertOption);
    const word = await wordConvert.convert(lyrics);
    setValue("word", word);
  }

  static deleteLine(dispatch: Dispatch<any>, line: Line) {
    dispatch(deleteLine(line.lineNumber));
    dispatch(addHistory({ type: "delete", data: line }));
    dispatch(setSelectedIndex(null));
  }
}
