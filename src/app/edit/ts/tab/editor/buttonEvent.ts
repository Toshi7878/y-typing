import { Dispatch } from "react";
import { addLine, deleteLine, updateLine } from "../../../redux/mapDataSlice";
import { WordConvert } from "./wordConvert";
import { addHistory } from "../../../redux/undoredoSlice";
import { setCanUpload } from "../../../redux/buttonFlagsSlice";
import { Line } from "@/types";
import { SetLineFunctions } from "../../type";

export class ButtonEvents {
  static addLine(dispatch: Dispatch<any>, line: Line) {
    dispatch(addLine({ time: line.time, lyrics: line.lyrics, word: line.word }));
    dispatch(setCanUpload(true));
    dispatch(addHistory({ type: "add", data: line }));
  }

  static updateLine(dispatch: Dispatch<any>, line: Line) {
    dispatch(
      updateLine({
        time: line.time,
        lyrics: line.lyrics,
        word: line.word,
        lineNumber: line.lineNumber,
      }),
    );
  }

  static async lyricsConvert(
    lyrics: string,
    setLineFunctions: SetLineFunctions,
    convertOption: string,
  ) {
    const wordConvert = new WordConvert(convertOption);
    const word = lyrics ? await wordConvert.convert(lyrics) : "";
    setLineFunctions.setWord(word ?? "");
  }

  static deleteLine(dispatch: Dispatch<any>, line: Line) {
    dispatch(deleteLine(line.lineNumber));
    dispatch(setCanUpload(true));
    dispatch(addHistory({ type: "delete", data: line }));
  }
}
