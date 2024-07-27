import { Box } from "@chakra-ui/react";
import React, { memo } from "react";
import "../../../../../style/type.scss";

interface WordProps {
  correct: string;
  nextChar: string;
  word: string;
  className?: string;
  id: string;
}

const PlayingWord = memo(({ correct, nextChar, word, className, id = "" }: WordProps) => {
  return (
    <Box id={id} className={className}>
      <span className="text-teal-500 word-correct">{correct}</span>
      <span className=" word">{`${nextChar}${word}`}</span>
    </Box>
  );
});
PlayingWord.displayName = "PlayingWord";

export default PlayingWord;
