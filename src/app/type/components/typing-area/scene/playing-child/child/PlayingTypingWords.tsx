import { Box, useTheme } from "@chakra-ui/react";
import React, { useEffect } from "react";
import PlayingWord from "./PlayingWord";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useLineSelectIndexAtom,
  useLineWordAtom,
  useMapAtom,
  useRankingScoresAtom,
  useSceneAtom,
  useSkipAtom,
  useUserOptionsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { ThemeColors } from "@/types";
import { useHandleKeydown } from "@/app/type/hooks/playing-hooks/keydown-hooks/useHandleKeydown";
import { usePlayTimer } from "@/app/type/hooks/playing-hooks/timer-hooks/useTimer";
import { typeTicker } from "@/app/type/hooks/useYoutubeEvents";

const PlayingTypingWords = () => {
  const lineWord = useLineWordAtom();
  const inputMode = useInputModeAtom();
  const theme: ThemeColors = useTheme();
  const playTimer = usePlayTimer();

  const handleKeydown = useHandleKeydown();
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    typeTicker.add(playTimer);

    return () => {
      typeTicker.remove(playTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
};

export default PlayingTypingWords;
