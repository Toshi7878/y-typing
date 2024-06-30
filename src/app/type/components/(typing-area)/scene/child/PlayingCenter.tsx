import { Box, VStack } from "@chakra-ui/react";
import {
  lyricsAtom,
  lineWordAtom,
  nextLyricsAtom,
  statusAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { isTyped, Miss, Success, Typing } from "@/app/type/(ts)/keydown";
import Word from "./Word";
import Lyrics from "./child/PlayingLyrics";

export interface Word {
  correct: { k: string; r: string };
  nextChar: { k: string; r: string[]; p: number };
  word: { k: string; r: string[]; p: number }[];
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
  const [status, setStatus] = useAtom(statusAtom);

  useImperativeHandle(ref, () => ({
    setLineWord: (newLineWord) => setLineWord(newLineWord),
    setLyrics: (newLyrics) => setLyrics(newLyrics),
    setNextLyrics: (newNextLyrics) => setNextLyrics(newNextLyrics),
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTyped({ event, lineWord })) {
        const result = new Typing({ event, lineWord });

        if (result.newLineWord) {
          // 変更
          setStatus(new Success(status, result.updatePoint, result.newLineWord).newStatus);
          setLineWord(result.newLineWord);
        } else {
          setStatus(new Miss(status).newStatus);
        }
      }

      const IS_COPY = event.ctrlKey && event.code == "KeyC";
      if (!IS_COPY) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWord, status]);

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
