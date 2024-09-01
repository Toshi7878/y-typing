import {
  useEditAddLyricsInputAtom,
  useEditLineLyricsAtom,
  useSetEditAddLyricsInputAtom,
} from "../edit-atom/editAtom";
import { useSetTopLyricsText } from "./useSetTopLyricsText";

export const useSetAddLyrics = () => {
  const lyrics = useEditLineLyricsAtom();
  const lyricsText = useEditAddLyricsInputAtom();
  const setLyricsText = useSetEditAddLyricsInputAtom();
  const setTopLyricsText = useSetTopLyricsText();

  return (newLyricsText: string | null) => {
    if (newLyricsText !== null) {
      setLyricsText(newLyricsText);
    }
    const lines = (newLyricsText !== null ? newLyricsText : lyricsText).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      setTopLyricsText(topLyrics);
    }
  };
};
