import {
  useEditAddLyricsTextAtom,
  useEditLineLyricsAtom,
  useEditWordConvertOptionAtom,
  useLineInputReducer,
  useSetEditAddLyricsTextAtom,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { ButtonEvents } from "../ts/tab/editor/buttonEvent";

export function useSetTopLyricsText() {
  const lineInputReducer = useLineInputReducer();
  const lyricsText = useEditAddLyricsTextAtom();
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

  return (lyrics: string, addLyrics: string) => {
    const lines = addLyrics?.split("\n") || [];
    const topLine = lines[0];
    const newText = lines.slice(1).join("\n");

    if (lyrics === topLine) {
      setLyricsText(newText);
    }

    const newLyrics: string = (newText?.split("\n") || [""])[0];
    setTopLyricsText(newLyrics);
  };
};
