import { Box, Textarea, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { useEditAddLyricsTextAtom } from "@/app/edit/edit-atom/editAtom";
import { useSetAddLyrics } from "@/app/edit/hooks/useEditAddLyricsTextHooks";
import { useAddLyricsTextPasteEvents } from "@/app/edit/hooks/useEditPasteEventHooks";

const EditorAddLyricsInput = () => {
  const theme: ThemeColors = useTheme();
  const pasteEvent = useAddLyricsTextPasteEvents();
  const lyricsText = useEditAddLyricsTextAtom();
  const setAddLyrics = useSetAddLyrics();

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        placeholder="ここから歌詞をまとめて追加できます"
        size="lg"
        style={{ height: "110px" }}
        value={lyricsText}
        bg={theme.colors.background}
        borderColor={`${theme.colors.card.borderColor}80`}
        onPaste={pasteEvent}
        onChange={(e) => setAddLyrics(e.target.value)}
      />
    </Box>
  );
};

export default EditorAddLyricsInput;
