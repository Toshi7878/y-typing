import { Dispatch } from "react";
import { addLine, updateLine } from "../../(redux)/mapDataSlice";

interface LineType {
  time: string;
  lyrics: string;
  word: string;
}

export class ButtonEvents {
  static addLine(dispatch: Dispatch<any>, line: LineType) {
    console.log("add");
    dispatch(
      addLine({ time: line.time, lyrics: line.lyrics, word: line.word })
    );
  }

  static updateLine(
    dispatch: Dispatch<any>,
    line: LineType,
    lineNumber: string
  ) {
    console.log("update");
    dispatch(
      updateLine({
        time: line.time,
        lyrics: line.lyrics,
        word: line.word,
        lineNumber: lineNumber,
      })
    );
  }
}
