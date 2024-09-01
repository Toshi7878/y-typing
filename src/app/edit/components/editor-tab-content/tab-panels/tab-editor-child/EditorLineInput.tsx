import { Input, Box, useTheme } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Dispatch, useEffect, useRef } from "react";
import { ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";

import { useAtom, useAtomValue } from "jotai";
import {
  editLineLyricsAtom,
  editLineSelectedNumberAtom as editSelectedLineCountAtom,
  editLineWordAtom,
} from "@/app/edit/edit-atom/editAtom";
import EditorTimeInput from "./EditorTimeInput";
import { EditorTimeInputRef } from "@/app/edit/ts/type";

interface EditorLineInputProps {
  setIsTimeInputValid: Dispatch<boolean>;
}

const EditorLineInput = (props: EditorLineInputProps) => {
  const theme: ThemeColors = useTheme();

  const timeInputRef = useRef<EditorTimeInputRef | null>(null);

  const selectedLineCount = useAtomValue(editSelectedLineCountAtom);
  const [lyrics, setLyrics] = useAtom(editLineLyricsAtom);
  const [word, setWord] = useAtom(editLineWordAtom);

  const mapData = useSelector((state: RootState) => state.mapData.value);

  useEffect(() => {
    if (selectedLineCount !== null && mapData[selectedLineCount]) {
      const line = mapData[selectedLineCount];

      setLyrics(line.lyrics || "");
      setWord(line.word || "");
      timeInputRef.current!.selectedTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLineCount, mapData]);

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
        />
      </Box>
      <Box display="flex" alignItems="center">
        <Input
          placeholder="No."
          size="sm"
          width="90px"
          disabled
          variant="filled"
          opacity={1}
          _disabled={{ opacity: 1 }}
          value={selectedLineCount ?? ""}
        />
        <Input
          placeholder="ワード"
          size="sm"
          autoComplete="off"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
      </Box>
    </>
  );
};

export default EditorLineInput;
