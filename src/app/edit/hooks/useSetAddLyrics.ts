import {
  useEditAddLyricsInputAtom,
  useEditLineLyricsAtom,
  useEditWordConvertOptionAtom,
  useLineInputReducer,
  useSetEditAddLyricsInputAtom,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { TextAreaEvents } from "../ts/tab/editor/textAreaEvent";

export const useSetAddLyrics = () => {
  const lyrics = useEditLineLyricsAtom();
  const convertOption = useEditWordConvertOptionAtom();
  const lyricsText = useEditAddLyricsInputAtom();
  const setLyricsText = useSetEditAddLyricsInputAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const lineInputReducer = useLineInputReducer();

  return (newLyricsText: string | null) => {
    if (newLyricsText !== null) {
      setLyricsText(newLyricsText);
    }
    const lines = (newLyricsText !== null ? newLyricsText : lyricsText).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      TextAreaEvents.setTopLyrics(lineInputReducer, topLyrics, setIsLoadWordConvert, convertOption);
    }
  };
};
