import { Input, Box, useTheme } from "@chakra-ui/react";
import { useRef, useState } from "react";
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
import { useAddRubyTagEvent } from "@/app/edit/hooks/useEditKeyDownEvents";
import CustomToolTip from "@/components/CustomToolTip";

const EditorLineInput = () => {
  const [isLineLyricsSelected, setIsLineLyricsSelected] = useState(false);
  const theme: ThemeColors = useTheme();

  const timeInputRef = useRef<EditorTimeInputRef>(null);
  const selectedLineCount = useEditLineSelectedCountAtom();
  const lyrics = useEditLineLyricsAtom();
  const word = useEditLineWordAtom();
  const setLyrics = useSetEditLineLyricsAtom();
  const setWord = useSetEditLineWordAtom();
  const handleEnterAddRuby = useAddRubyTagEvent();

  return (
    <>
      <Box display="flex" alignItems="center">
        <EditorTimeInput ref={timeInputRef} />
        <CustomToolTip
          tooltipLabel={<Box fontSize="xs">Enterキーを押すとRubyタグを挿入できます。</Box>}
          placement="top"
          isDisabled={!isLineLyricsSelected}
          isOpen={isLineLyricsSelected}
        >
          <Input
            placeholder="歌詞"
            size="sm"
            autoComplete="off"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            onKeyDown={handleEnterAddRuby}
            onSelect={(e) => {
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;

              const isSelected = end !== null && start !== null && end - start > 0;
              setIsLineLyricsSelected(isSelected);
            }}
          />
        </CustomToolTip>
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
