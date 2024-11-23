import { Box, useTheme } from "@chakra-ui/react";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import PlayingWord from "./PlayingWord";
import { useInputModeAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { ThemeColors } from "@/types";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { defaultLineWord } from "../PlayingCenter";
import { WordType } from "@/app/type/ts/type";

export interface PlayingTypingWordsRef {
  setLineWord: (newLineWord: WordType) => void;
  getLineWord: () => WordType;
}

const PlayingTypingWords = forwardRef<PlayingTypingWordsRef>((props, ref) => {
  const { setRef } = useRefs();
  const [lineWord, setLineWord] = useState(structuredClone(defaultLineWord));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("playingTypingWordsRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWord]);

  useImperativeHandle(ref, () => ({
    setLineWord: (newLineWord) => setLineWord(newLineWord),
    getLineWord: () => lineWord,
  }));

  const inputMode = useInputModeAtom();
  const theme: ThemeColors = useTheme();

  return (
    <Box
      color={theme.colors.text.body}
      fontSize="2.75rem"
      className="word-font outline-text"
      style={{ letterSpacing: "0.1em" }}
    >
      <PlayingWord
        id="main_word"
        correct={lineWord.correct["k"].slice(-10).replace(/ /g, "ˍ")}
        nextChar={lineWord.nextChar["k"]}
        word={lineWord.word.map((w) => w["k"]).join("")}
        className="lowercase word-kana"
      />

      <PlayingWord
        id="sub_word"
        correct={lineWord.correct["r"].slice(-16).replace(/ /g, "ˍ")}
        nextChar={lineWord.nextChar["r"][0]}
        word={lineWord.word.map((w) => w["r"][0]).join("")}
        className={`uppercase word-roma ${inputMode === "kana" ? "invisible" : ""}`}
      />
    </Box>
  );
});

PlayingTypingWords.displayName = "PlayingTypingWords";

export default PlayingTypingWords;
