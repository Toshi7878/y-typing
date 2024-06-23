import { Box, VStack } from "@chakra-ui/react";
import { lyricsAtom, lineWordAtom, nextLyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Typing } from "@/app/type/(ts)/keydown";
import Word from "./Word";
import Lyrics from "./child/PlayingLyrics";

export interface Word {
  correct: { k: string; r: string };
  nextChar: { k: string; r: string[] };
  word: { k: string; r: string[] }[];
}

export interface PlayingCenterRef {
  setLineWord: (newLineWord: Word) => void;
  setLyrics: (newLyrics: string) => void;
  setNextLyrics: (newNextLyrics: string) => void;
}

const PlayingCenter = forwardRef<PlayingCenterRef>((props, ref) => {
  const [lineWord, setLineWord] = useAtom(lineWordAtom);
  const [lyrics, setLyrics] = useAtom(lyricsAtom);
  const [nextLyrics, setNextLyrics] = useAtom(nextLyricsAtom);

  useImperativeHandle(ref, () => ({
    setLineWord: (newLineWord) => setLineWord(newLineWord),
    setLyrics: (newLyrics) => setLyrics(newLyrics),
    setNextLyrics: (newNextLyrics) => setNextLyrics(newNextLyrics),
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const result = new Typing({ event, lineWord }).lineWord;
      if (result) {
        setLineWord(result);
      }

      const IS_COPY = event.ctrlKey && event.code == "KeyC";
      if (event.type == "keydown" && !IS_COPY) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWord]);

  return (
    <VStack p="4" className="text-xl" display="inline">
      <Box>
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
    </VStack>
  );
});

PlayingCenter.displayName = "PlayingCenter"; // 追加

export default PlayingCenter;
