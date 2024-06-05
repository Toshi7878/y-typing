import { Dispatch } from "react";
import { addLine, deleteLine, updateLine } from "../../(redux)/mapDataSlice";
import { DefaultValues } from "../TabFormProvider";

export class ButtonEvents {
  static addLine(dispatch: Dispatch<any>, line: DefaultValues["EditorTab"]) {
    console.log("add");
    dispatch(
      addLine({ time: line.time, lyrics: line.lyrics, word: line.word })
    );
  }

  static updateLine(dispatch: Dispatch<any>, line: DefaultValues["EditorTab"]) {
    console.log("update");
    dispatch(
      updateLine({
        time: line.time,
        lyrics: line.lyrics,
        word: line.word,
        lineNumber: line.lineNumber,
      })
    );
  }

  static deleteLine(dispatch: Dispatch<any>, lineNumber: string) {
    console.log("delete");
    dispatch(deleteLine(lineNumber));
  }
}
