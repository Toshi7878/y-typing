import { VStack } from "@chakra-ui/react";
import { useRef } from "react";
import PlayingLyrics from "./child/PlayingLyrics";
import type { NextLyricsType, WordType } from "@/app/type/ts/type";
import NextLyrics from "./child/PlayingNextLyrics";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import "@/css/type.css";
import { CARD_BODY_MIN_HEIGHT } from "../../TypingCard";
import { useLyricsAtom, useNextLyricsAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import PlayingTypingWords, { PlayingTypingWordsRef } from "./child/PlayingTypingWords";

interface PlayingCenterProps {
  flex: string;
}

export const defaultLineWord: WordType = {
  correct: { k: "", r: "" },
  nextChar: { k: "", r: [""], p: 0 },
  word: [{ k: "", r: [""], p: 0 }],
  lineCount: 0,
};

export const defaultNextLyrics: NextLyricsType = {
  lyrics: "",
  kpm: "",
};

const PlayingCenter = ({ flex }: PlayingCenterProps) => {
  const lyrics = useLyricsAtom();
  const nextLyrics = useNextLyricsAtom();
  const { gameStateRef } = useRefs();

  const playMode = gameStateRef.current!.playMode;

  const playingTypingWordsRef = useRef<PlayingTypingWordsRef>(null);

  return (
    <VStack
      className={`${playMode === "playing" ? "cursor-none" : ""}`}
      flex={flex}
      isTruncated
      ml={-2}
      align="start"
      minH={CARD_BODY_MIN_HEIGHT}
      justifyContent="space-between"
      style={{ userSelect: "none", cursor: "none" }}
    >
      <PlayingTypingWords ref={playingTypingWordsRef} />
      <PlayingLyrics lyrics={lyrics} />

      <NextLyrics lyrics={nextLyrics.lyrics} kpm={nextLyrics.kpm} />
    </VStack>
  );
};

export default PlayingCenter;
