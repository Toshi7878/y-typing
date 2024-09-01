import { Dispatch } from "react";
import { addLine, deleteLine, updateLine } from "../../../redux/mapDataSlice";
import { WordConvert } from "./wordConvert";
import { addHistory } from "../../../redux/undoredoSlice";
import { LineEdit } from "@/types";
import { Action } from "@reduxjs/toolkit";

export class ButtonEvents {
  static addLine(dispatch: Dispatch<Action>, setCanUpload: Dispatch<boolean>, line: LineEdit) {
    dispatch(addLine({ time: line.time, lyrics: line.lyrics, word: line.word }));
    setCanUpload(true);
    dispatch(addHistory({ type: "add", data: line }));
  }

  static updateLine(dispatch: Dispatch<any>, line: LineEdit) {
    dispatch(
      updateLine({
        time: line.time,
        lyrics: line.lyrics,
        word: line.word,
        selectedLineCount: line.selectedLineCount,
      }),
    );
  }

  static async lyricsConvert(lyrics: string, convertOption: string) {
    const wordConvert = new WordConvert(convertOption);
    const word = lyrics ? await wordConvert.convert(lyrics) : "";
    return word ?? "";
  }

  static deleteLine(dispatch: Dispatch<Action>, setCanUpload: Dispatch<boolean>, line: LineEdit) {
    dispatch(deleteLine(line.selectedLineCount));
    setCanUpload(true);
    dispatch(addHistory({ type: "delete", data: line }));
  }
}
