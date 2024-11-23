import {
  useInputModeAtom,
  useMapAtom,
  useSetInputModeAtom,
  useSetPlayingNotifyAtom,
  useTypePageSpeedAtom,
  useUserOptionsAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { romaConvert } from "../../ts/scene-ts/ready/createTypingWord";
import { InputModeType } from "../../ts/type";

export const useInputModeChange = () => {
  const { playingCenterRef, statusRef } = useRefs();

  const map = useMapAtom();
  const speedData = useTypePageSpeedAtom();
  const inputMode = useInputModeAtom();
  const setInputMode = useSetInputModeAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const userOptions = useUserOptionsAtom();

  return (newInputMode: InputModeType, lineTime?: number) => {
    if (newInputMode === inputMode) {
      return;
    }

    setInputMode(newInputMode);

    if (newInputMode === "kana") {
      setNotify(Symbol("KanaMode"));
    } else {
      setNotify(Symbol("Romaji"));
      const lineWord = playingCenterRef.current!.getLineWord();

      if (lineWord.nextChar["k"]) {
        const wordFix = romaConvert(lineWord);

        playingCenterRef.current!.setLineWord({
          correct: lineWord.correct,
          nextChar: wordFix.nextChar,
          word: wordFix.word,
          lineCount: lineWord.lineCount,
        });
      }
    }

    const count = statusRef.current!.status.count;
    const nextLine = map!.mapData[count];
    const nextKpm =
      (inputMode === "roma" ? map!.mapData[count].kpm["r"] : map!.mapData[count].kpm["k"]) *
      speedData.playSpeed;
    if (nextKpm) {
      playingCenterRef.current!.setNextLyrics({
        lyrics: userOptions.nextDisplay === "word" ? nextLine.kanaWord : nextLine["lyrics"],
        kpm: nextKpm.toFixed(0),
      });
    }

    if (lineTime) {
      statusRef.current!.lineStatus.typeResult.push({
        op: newInputMode,
        t: Math.round(lineTime * 1000) / 1000,
      });
    }
  };
};
