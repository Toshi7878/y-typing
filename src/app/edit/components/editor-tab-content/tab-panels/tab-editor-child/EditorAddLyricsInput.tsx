import { Box, Textarea, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";

import { SetLineFunctions } from "@/app/edit/ts/type";
import { useAtom, useSetAtom } from "jotai";
import {
  editAddLyricsTextBoxAtom,
  editLineLyricsAtom,
  editLineWordAtom,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";

const EditorAddLyricsInput = () => {
  const theme: ThemeColors = useTheme();

  const { editSettingsRef } = useRefs();
  const [lyrics, setLyrics] = useAtom(editLineLyricsAtom);
  const setWord = useSetAtom(editLineWordAtom);
  const [lyricsText, setLyricsText] = useAtom(editAddLyricsTextBoxAtom);

  const setLineFunctions: SetLineFunctions = { setLyrics, setWord, setLyricsText };

  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();

  const setAddLyrics = (e: React.ChangeEvent<HTMLTextAreaElement> | null) => {
    setLyricsText(e!.target.value);
    const lines = (e ? (e.target as HTMLTextAreaElement).value : lyricsText).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      const convertOption = editSettingsRef.current!.getWordConvertOption();

      TextAreaEvents.setTopLyrics(setLineFunctions, topLyrics, setIsLoadWordConvert, convertOption);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        placeholder="ここから歌詞をまとめて追加できます"
        size="lg"
        style={{ height: "110px" }}
        value={lyricsText}
        onPaste={() => {
          const convertOption = editSettingsRef.current!.getWordConvertOption();
          TextAreaEvents.paste(setLineFunctions, setIsLoadWordConvert, convertOption);
        }}
        onChange={(e) => setAddLyrics(e)}
      />
    </Box>
  );
};

export default EditorAddLyricsInput;
