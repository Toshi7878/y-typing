import { Box, Textarea, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";

import {
  useEditAddLyricsInputAtom,
  useEditWordConvertOptionAtom,
  useLineInputReducer,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useSetAddLyrics } from "@/app/edit/hooks/useSetAddLyrics";
import { useSetTopLyricsText } from "@/app/edit/hooks/useSetTopLyricsText";

const EditorAddLyricsInput = () => {
  const theme: ThemeColors = useTheme();

  const lyricsText = useEditAddLyricsInputAtom();
  const convertOption = useEditWordConvertOptionAtom();

  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const lineInputReducer = useLineInputReducer();
  const setAddLyrics = useSetAddLyrics();
  const setTopLyricsText = useSetTopLyricsText();

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        placeholder="ここから歌詞をまとめて追加できます"
        size="lg"
        style={{ height: "110px" }}
        value={lyricsText}
        bg={theme.colors.background}
        borderColor={`${theme.colors.card.borderColor}80`}
        onPaste={() => {
          TextAreaEvents.paste(setTopLyricsText);
        }}
        onChange={(e) => setAddLyrics(e.target.value)}
      />
    </Box>
  );
};

export default EditorAddLyricsInput;
