import { Box, Text } from "@chakra-ui/react";
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
  const remainWord = nextChar + word;

  return (
    <Box id={id} className={className}>
      <Text
        as="span"
        color={remainWord.length === 0 ? "type.word.completed" : "type.word.correct"}
        className="word-correct"
      >
        {correct}
      </Text>
      <Text as="span" color={"type.word.next"} className="word-next">
        {nextChar}
      </Text>
      <Text as="span" color={"type.word.word"} className="word">
        {word}
      </Text>
    </Box>
  );
});
PlayingWord.displayName = "PlayingWord";

export default PlayingWord;
