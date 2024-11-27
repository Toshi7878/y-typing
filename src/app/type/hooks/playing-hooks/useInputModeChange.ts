import {
  inputModeAtom,
  lineWordAtom,
  sceneAtom,
  speedAtom,
  useMapAtom,
  userOptionsAtom,
  useSetInputModeAtom,
  useSetLineWordAtom,
  useSetNextLyricsAtom,
  useSetPlayingNotifyAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";
import { romaConvert } from "../../ts/scene-ts/ready/createTypingWord";
import { InputModeType } from "../../ts/type";
import { useGetTime } from "../useGetTime";
import { useStore } from "jotai";

export const useInputModeChange = () => {
  const { statusRef } = useRefs();

  const map = useMapAtom();
  const typeAtomStore = useStore();

  const setInputMode = useSetInputModeAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const setNextLyrics = useSetNextLyricsAtom();
  const { getCurrentLineTime, getCurrentOffsettedYTTime } = useGetTime();
  const setLineWord = useSetLineWordAtom();

  return (newInputMode: InputModeType) => {
    const inputMode = typeAtomStore.get(inputModeAtom);

    if (newInputMode === inputMode) {
      return;
    }

    setInputMode(newInputMode);

    if (newInputMode === "kana") {
      setNotify(Symbol("KanaMode"));
    } else {
      setNotify(Symbol("Romaji"));
      const lineWord = typeAtomStore.get(lineWordAtom);

      if (lineWord.nextChar["k"]) {
        const wordFix = romaConvert(lineWord);

        setLineWord({
          correct: lineWord.correct,
          nextChar: wordFix.nextChar,
          word: wordFix.word,
          lineCount: lineWord.lineCount,
        });
      }
    }

    const count = statusRef.current!.status.count;
    const nextLine = map!.mapData[count];
    const playSpeed = typeAtomStore.get(speedAtom).playSpeed;

    const nextKpm =
      (newInputMode === "roma" ? map!.mapData[count].kpm["r"] : map!.mapData[count].kpm["k"]) *
      playSpeed;
    if (nextKpm) {
      const userOptions = typeAtomStore.get(userOptionsAtom);

      setNextLyrics({
        lyrics: userOptions.nextDisplay === "word" ? nextLine.kanaWord : nextLine["lyrics"],
        kpm: nextKpm.toFixed(0),
      });
    }

    const scene = typeAtomStore.get(sceneAtom);

    if (scene === "playing") {
      const lineTime = getCurrentLineTime(getCurrentOffsettedYTTime());

      statusRef.current!.lineStatus.typeResult.push({
        op: newInputMode,
        t: Math.round(lineTime * 1000) / 1000,
      });
    }
  };
};
