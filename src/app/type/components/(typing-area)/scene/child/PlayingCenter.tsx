import { Box, VStack } from "@chakra-ui/react";
import {
  lyricsAtom,
  lineWordAtom,
  nextLyricsAtom,
  statusAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { isTyped, Miss, shortcutKey, Success, Typing } from "@/app/type/(ts)/keydown";
import Word from "./Word";
import Lyrics from "./child/PlayingLyrics";
import NextLyrics from "./child/PlayingNextLyrics";

export interface Word {
  correct: { k: string; r: string };
  nextChar: { k: string; r: string[]; p: number };
  word: { k: string; r: string[]; p: number }[];
}

export interface PlayingCenterRef {
  setLineWord: (newLineWord: Word) => void;
  setLyrics: (newLyrics: string) => void;
  setNextLyrics: (params: { lyrics: string; kpm: string }) => void;
  getLineWord: () => Word;
}

interface Props {
  flex: string;
}

const PlayingCenter = forwardRef<PlayingCenterRef, Props>(({ flex }, ref) => {
  const [lineWord, setLineWord] = useAtom(lineWordAtom);
  const [lyrics, setLyrics] = useAtom(lyricsAtom);
  const [nextLyrics, setNextLyrics] = useAtom(nextLyricsAtom);

  useImperativeHandle(ref, () => ({
    setLineWord: (newLineWord) => setLineWord(newLineWord),
    setLyrics: (newLyrics) => setLyrics(newLyrics),
    setNextLyrics: (params) => setNextLyrics(params),
    getLineWord: () => lineWord,
  }));


  return (
    <VStack p="2" className="text-xl" display="" flex={flex}>
      <Box
        className="outline-text word-font text-white font-bold ml-3"
        style={{ letterSpacing: "0.1em" }}
      >
        <Word
          id="main_word"
          correct={lineWord.correct["k"].replace(/ /g, "ˍ")}
          nextChar={lineWord.nextChar["k"]}
          word={lineWord.word.map((w) => w["k"]).join("")}
          className="lowercase mb-3"
        />

        <Word
          id="sub_word"
          correct={lineWord.correct["r"].replace(/ /g, "ˍ")}
          nextChar={lineWord.nextChar["r"][0]}
          word={lineWord.word.map((w) => w["r"][0]).join("")}
          className="uppercase"
        />
      </Box>

      <Lyrics lyrics={lyrics} />

      <NextLyrics
        size={"md"}
        className={"text-gray-400"}
        lyrics={nextLyrics.lyrics}
        kpm={nextLyrics.kpm}
      />
    </VStack>
  );
});

PlayingCenter.displayName = "PlayingCenter"; // 追加

export default PlayingCenter;
