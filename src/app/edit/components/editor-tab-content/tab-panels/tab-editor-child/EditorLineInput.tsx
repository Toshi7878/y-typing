import { Input, Box, useTheme } from "@chakra-ui/react";
import { Dispatch, useRef } from "react";
import { ThemeColors } from "@/types";

import EditorTimeInput from "./EditorTimeInput";
import { EditorTimeInputRef } from "@/app/edit/ts/type";
import {
  useEditLineLyricsAtom,
  useEditLineSelectedCountAtom,
  useEditLineWordAtom,
  useSetEditLineLyricsAtom,
  useSetEditLineWordAtom,
} from "@/app/edit/edit-atom/editAtom";

interface EditorLineInputProps {
  setIsTimeInputValid: Dispatch<boolean>;
}

const EditorLineInput = (props: EditorLineInputProps) => {
  const theme: ThemeColors = useTheme();

  const timeInputRef = useRef<EditorTimeInputRef>(null);
  const selectedLineCount = useEditLineSelectedCountAtom();
  const lyrics = useEditLineLyricsAtom();
  const setLyrics = useSetEditLineLyricsAtom();
  const word = useEditLineWordAtom();
  const setWord = useSetEditLineWordAtom();

  return (
    <>
      <Box display="flex" alignItems="center">
        <EditorTimeInput ref={timeInputRef} onFormStateChange={props.setIsTimeInputValid} />
        <Input
          placeholder="歌詞"
          size="sm"
          autoComplete="off"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          bg={theme.colors.background}
          borderColor={`${theme.colors.card.borderColor}60`}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <Input
          placeholder="No."
          size="sm"
          width="90px"
          disabled
          variant="filled"
          bg={theme.colors.background}
          borderColor={`${theme.colors.card.borderColor}60`}
          opacity={1}
          _disabled={{ opacity: 1 }}
          value={selectedLineCount ?? ""}
        />
        <Input
          placeholder="ワード"
          size="sm"
          autoComplete="off"
          bg={theme.colors.background}
          borderColor={`${theme.colors.card.borderColor}60`}
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
      </Box>
    </>
  );
};

export default EditorLineInput;
