import { Box, Textarea, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";

import {
  useEditAddLyricsInputAtom,
  useLineInputReducer,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { useSetAddLyrics } from "@/app/edit/hooks/useSetAddLyrics";

const EditorAddLyricsInput = () => {
  const theme: ThemeColors = useTheme();

  const { editSettingsRef } = useRefs();
  const lyricsText = useEditAddLyricsInputAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const lineInputReducer = useLineInputReducer();
  const setAddLyrics = useSetAddLyrics();

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        placeholder="ここから歌詞をまとめて追加できます"
        size="lg"
        style={{ height: "110px" }}
        value={lyricsText}
        onPaste={() => {
          const convertOption = editSettingsRef.current!.getWordConvertOption();
          TextAreaEvents.paste(lineInputReducer, setIsLoadWordConvert, convertOption);
        }}
        onChange={(e) => setAddLyrics(e.target.value)}
      />
    </Box>
  );
};

export default EditorAddLyricsInput;
