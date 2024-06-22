import { Box, Stack } from "@chakra-ui/react";
import Lyrics from "./child/Lyrics";
import { lyricsAtom, mainWordAtom, nextLyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import Word from "./child/Word";
import { Typing } from "@/app/type/(ts)/keydown";

export interface Word {
  correct: { k: string; r: string };
  nextChar: { k: string; r: string[] };
  word: { k: string; r: string[] }[];
}
export interface PlayingHandle {
  setMainWord: (newWord: Word) => void;
  setLyrics: (newLyrics: string) => void;
  setNextLyrics: (newNextLyrics: string) => void;
}

const Playing = forwardRef<PlayingHandle>(function Playing(props, ref) {
  const [lineWord, setLineWord] = useAtom(mainWordAtom);
  const [lyrics, setLyrics] = useAtom(lyricsAtom);
  const [nextLyrics, setNextLyrics] = useAtom(nextLyricsAtom);

  useImperativeHandle(ref, () => ({
    setMainWord: (newWord) => setLineWord(newWord),
    setLyrics: (newLyrics) => setLyrics(newLyrics),
    setNextLyrics: (newNextLyrics) => setNextLyrics(newNextLyrics),
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const result: Word = new Typing({ event, lineWord }).lineWord;
      setLineWord(result);

      const IS_COPY = event.ctrlKey && event.code == "KeyC";
      if (event.type == "keydown" && !IS_COPY) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <Stack p="4" className="text-xl" display="inline">
      <Box mb="4">
        <Word
          id="main-word"
          correct={lineWord.correct["k"].replace(/ /g, "ˍ")}
          nextChar={lineWord.nextChar["k"]}
          word={lineWord.word.map((w) => w["k"]).join("")}
          className="lowercase"
        />

        <Word
          id="main-word"
          correct={lineWord.correct["r"].replace(/ /g, "ˍ")}
          nextChar={lineWord.nextChar["r"][0]}
          word={lineWord.word.map((w) => w["r"][0]).join("")}
          className="uppercase"
        />
      </Box>

      <Lyrics lyrics={lyrics} />

      <Lyrics
        size={"md"}
        className={"text-gray-400"}
        lyrics={nextLyrics ? `NEXT: ${nextLyrics}` : ""}
      />
    </Stack>
  );
});
export default Playing;
