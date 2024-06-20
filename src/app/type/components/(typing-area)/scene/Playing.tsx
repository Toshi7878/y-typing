import { Box } from "@chakra-ui/react";
import Lyrics from "./child/Lyrics";
import {
  lyricsAtom,
  mainWordAtom,
  nextLyricsAtom,
  subWordAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
import Word from "./child/Word";

export interface Word {
  correct: string;
  nextChar: string;
  word: string;
}
export interface PlayingHandle {
  setMainWord: (newWord: Word) => void;
  setSubWord: (newWord: Word) => void;
  setLyrics: (newLyrics: string) => void;
  setNextLyrics: (newNextLyrics: string) => void;
}

const Playing = forwardRef<PlayingHandle>(function Playing(props, ref) {
  const [mainWord, setMainWord] = useAtom(mainWordAtom);
  const [subWord, setSubWord] = useAtom(subWordAtom);
  const [lyrics, setLyrics] = useAtom(lyricsAtom);
  const [nextLyrics, setNextLyrics] = useAtom(nextLyricsAtom);

  useImperativeHandle(ref, () => ({
    setMainWord: (newWord) => setMainWord(newWord),
    setSubWord: (newWord) => setSubWord(newWord),
    setLyrics: (newLyrics) => setLyrics(newLyrics),
    setNextLyrics: (newNextLyrics) => setNextLyrics(newNextLyrics),
  }));
  return (
    <Box p="4" className="text-xl" display="inline">
      <Word
        id={"main-word"}
        correct={mainWord.correct}
        nextChar={mainWord.nextChar}
        word={mainWord.word}
      />
      <Word
        id={"sub-word"}
        correct={subWord.correct}
        nextChar={subWord.nextChar}
        word={subWord.word}
      />
      <Lyrics lyrics={lyrics} />
      <Lyrics className={" text-gray-400 text-xs"} lyrics={nextLyrics} />
    </Box>
  );
});
export default Playing;
