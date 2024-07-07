import { Box, VStack } from "@chakra-ui/react";
import { lyricsAtom, lineWordAtom, nextLyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useImperativeHandle } from "react";
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
    <VStack p="2" className="truncate" display="" flex={flex}>
      <Box
        className="word-font outline-text text-white font-bold ml-3 mb-2 mt-1"
        style={{ letterSpacing: "0.1em" }}
      >
        <Word
          id="main_word"
          correct={lineWord.correct["k"].slice(-10).replace(/ /g, "ˍ")}
          nextChar={lineWord.nextChar["k"]}
          word={lineWord.word.map((w) => w["k"]).join("")}
          className="lowercase text-[2.5rem]"
        />

        <Word
          id="sub_word"
          correct={lineWord.correct["r"].slice(-16).replace(/ /g, "ˍ")}
          nextChar={lineWord.nextChar["r"][0]}
          word={lineWord.word.map((w) => w["r"][0]).join("")}
          className="uppercase ml-1 text-[2.5rem]"
        />
      </Box>

      <Lyrics
        lyrics={lyrics}
        className="-indent-2 mb-4 font-bold text-[2.5rem] text-truncate lyrics-font"
      />

      <NextLyrics
        className={"text-gray-400 ml-3 text-3xl lyrics-font"}
        lyrics={nextLyrics.lyrics}
        kpm={nextLyrics.kpm}
      />
    </VStack>
  );
});

PlayingCenter.displayName = "PlayingCenter"; // 追加

export default PlayingCenter;