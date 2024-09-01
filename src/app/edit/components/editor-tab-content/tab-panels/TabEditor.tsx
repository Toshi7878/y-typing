import { Box, Card, CardBody, useTheme } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Line, ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";

import { EditorButtonsRef, EditorTabRef, SetLineFunctions } from "@/app/edit/ts/type";
import { useAtom, useSetAtom } from "jotai";
import {
  editAddLyricsTextBoxAtom,
  editLineLyricsAtom,
  editLineSelectedNumberAtom as editSelectedLineCountAtom,
  editLineWordAtom,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";
import EditorButtons from "./tab-editor-child/EditorButtons";
import EditorLineInput from "./tab-editor-child/EditorLineInput";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import EditorAddLyricsInput from "./tab-editor-child/EditorAddLyricsInput";

const TabEditor = forwardRef<EditorTabRef, unknown>((props, ref) => {
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const theme: ThemeColors = useTheme();

  const editorButtonsRef = useRef<EditorButtonsRef>(null);

  const { editorTimeInputRef, editSettingsRef } = useRefs();
  const [selectedLineCount, setSelectedLineCount] = useAtom(editSelectedLineCountAtom);
  const [lyrics, setLyrics] = useAtom(editLineLyricsAtom);
  const setWord = useSetAtom(editLineWordAtom);
  const [lyricsText, setLyricsText] = useAtom(editAddLyricsTextBoxAtom);

  const setLineFunctions: SetLineFunctions = { setLyrics, setWord, setLyricsText };
  const mapData = useSelector((state: RootState) => state.mapData!.value);

  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();

  const lineInit = () => {
    setLyrics("");
    setWord("");
    setSelectedLineCount(null);

    editorTimeInputRef.current!.clearTime();
  };

  useEffect(() => {
    if (selectedLineCount !== null && mapData[selectedLineCount]) {
      const line = mapData[selectedLineCount];

      setLyrics(line.lyrics || "");
      setWord(line.word || "");
      editorTimeInputRef.current!.selectedTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLineCount, mapData]);

  useImperativeHandle(ref, () => ({
    undoAddLyrics: (undoLine: Line) => {
      TextAreaEvents.undoTopLyrics(setLineFunctions, undoLine, lyricsText);
      editorTimeInputRef.current!.undoAdd(undoLine.time);
    },

    lineInit: () => {
      lineInit();
    },

    redoAddLyrics: () => {
      const convertOption = editSettingsRef.current!.getWordConvertOption();

      TextAreaEvents.deleteTopLyrics(
        setLineFunctions,
        lyrics,
        lyricsText,
        setIsLoadWordConvert,
        convertOption,
      );
    },
  }));

  return (
    <Card variant="filled" bg={theme.colors.card.bg} boxShadow="lg" color={theme.colors.card.color}>
      <CardBody py={4}>
        <Box display="flex" flexDirection="column" gap={1}>
          <EditorLineInput setIsTimeInputValid={setIsTimeInputValid} />
          <EditorButtons ref={editorButtonsRef} isTimeInputValid={isTimeInputValid} />
          <EditorAddLyricsInput />
        </Box>
      </CardBody>
    </Card>
  );
});

TabEditor.displayName = "EditorTab";

export default TabEditor;
