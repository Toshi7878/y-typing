import { Box, Text, useTheme } from "@chakra-ui/react";
import React, { memo } from "react";

interface WordProps {
  correct: string;
  nextChar: string;
  word: string;
  className?: string;
  id: string;
}

const PlayingWord = memo(({ correct, nextChar, word, className, id = "" }: WordProps) => {
  const remainWord = nextChar + word;
  const theme = useTheme();

  return (
    <Box id={id} className={className}>
      <Text
        as="span"
        color={
          remainWord.length === 0
            ? theme.colors.type.word.completed
            : theme.colors.type.word.correct
        }
        className={remainWord.length === 0 ? "word-completed" : "word-correct"}
      >
        {correct}
      </Text>
      <Text as="span" color={theme.colors.type.word.next} className="word-next">
        {nextChar}
      </Text>
      <Text as="span" color={theme.colors.type.word.word} className="word">
        {word}
      </Text>
    </Box>
  );
});
PlayingWord.displayName = "PlayingWord";

export default PlayingWord;
