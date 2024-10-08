import {
  useEditAddLyricsTextAtom,
  useEditLineLyricsAtom,
  useLineInputReducer,
  useSetEditAddLyricsTextAtom,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { useWordConvert } from "./useWordConvert";

export function useSetTopLyricsText() {
  const lineInputReducer = useLineInputReducer();
  const lyricsText = useEditAddLyricsTextAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const wordConvert = useWordConvert();

  return async (newLyrics?: string | undefined) => {
    const lines = lyricsText.split("\n");
    const lyrics = newLyrics === undefined ? lines[0].replace(/\r$/, "") : newLyrics;

    setIsLoadWordConvert(true);
    const word = await wordConvert(lyrics);
    setIsLoadWordConvert(false);

    lineInputReducer({ type: "set", payload: { lyrics, word } });
  };
}

export const useSetAddLyrics = () => {
  const lyrics = useEditLineLyricsAtom();
  const lyricsText = useEditAddLyricsTextAtom();
  const setLyricsText = useSetEditAddLyricsTextAtom();
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

export const useDeleteTopLyricsText = () => {
  const setLyricsText = useSetEditAddLyricsTextAtom();
  const setTopLyricsText = useSetTopLyricsText();
  const lyricsText = useEditAddLyricsTextAtom();

  return (lyrics: string) => {
    const lines = lyricsText.split("\n") || [];
    const topLine = lines[0];
    const newText = lines.slice(1).join("\n");

    if (lyrics.replace(/\r$/, "") === topLine) {
      setLyricsText(newText);
    }

    const newLyrics: string = (newText?.split("\n") || [""])[0];
    setTopLyricsText(newLyrics);
  };
};
