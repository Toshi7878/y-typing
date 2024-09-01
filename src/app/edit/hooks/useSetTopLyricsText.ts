import {
  useEditAddLyricsInputAtom,
  useEditWordConvertOptionAtom,
  useLineInputReducer,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { ButtonEvents } from "../ts/tab/editor/buttonEvent";

export function useSetTopLyricsText() {
  const lineInputReducer = useLineInputReducer();
  const lyricsText = useEditAddLyricsInputAtom();
  const convertOption = useEditWordConvertOptionAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();

  return async (newLyrics?: string | undefined) => {
    const lines = lyricsText.split("\n");
    const lyrics = newLyrics === undefined ? lines[0].replace(/\r$/, "") : newLyrics;

    setIsLoadWordConvert(true);
    const word = await ButtonEvents.lyricsConvert(lyrics, convertOption);
    setIsLoadWordConvert(false);

    lineInputReducer({ type: "set", payload: { lyrics, word } });
  };
}
