import { Text } from "@chakra-ui/react";
import React, { memo } from "react";
import "../../../../style/type.scss";

interface WordProps {
  correct: string;
  nextChar: string;
  word: string;
  className?: string;
  id: string;
}

const Word = memo(({ correct, nextChar, word, className, id = "" }: WordProps) => {
  return (
    <Text id={id} fontSize="3xl" className={className}>
      <span className="text-teal-500">{correct}</span>
      <span>{`${nextChar}${word}`}</span>
    </Text>
  );
});
Word.displayName = "Lyrics";

export default Word;
