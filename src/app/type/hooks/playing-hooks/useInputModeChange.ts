import {
  useInputModeAtom,
  useMapAtom,
  useSetInputModeAtom,
  useSetPlayingNotifyAtom,
  useTypePageSpeedAtom,
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

  return (newInputMode: InputModeType) => {
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
        lyrics: nextLine["lyrics"],
        kpm: nextKpm.toFixed(0),
      });
    }
  };
};
