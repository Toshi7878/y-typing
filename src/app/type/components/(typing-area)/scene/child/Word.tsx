import { Box } from "@chakra-ui/react";
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
    <Box id={id} className={className}>
      <span className="text-teal-500">{correct}</span>
      <span>{`${nextChar}${word}`}</span>
    </Box>
  );
});
Word.displayName = "Lyrics";

export default Word;
