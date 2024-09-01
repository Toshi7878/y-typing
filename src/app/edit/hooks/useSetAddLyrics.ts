import {
  useEditAddLyricsInputAtom,
  useEditLineLyricsAtom,
  useLineInputReducer,
  useSetEditAddLyricsInputAtom,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { useRefs } from "../edit-contexts/refsProvider";
import { TextAreaEvents } from "../ts/tab/editor/textAreaEvent";

export const useSetAddLyrics = () => {
  const lyrics = useEditLineLyricsAtom();
  const { editSettingsRef } = useRefs();

  const lyricsText = useEditAddLyricsInputAtom();
  const setLyricsText = useSetEditAddLyricsInputAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const lineInputReducer = useLineInputReducer();

  return (newLyricsText: string | null) => {
    if (newLyricsText) {
      setLyricsText(newLyricsText);
    }
    const lines = (newLyricsText ? newLyricsText : lyricsText).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      const convertOption = editSettingsRef.current!.getWordConvertOption();

      TextAreaEvents.setTopLyrics(lineInputReducer, topLyrics, setIsLoadWordConvert, convertOption);
    }
  };
};
