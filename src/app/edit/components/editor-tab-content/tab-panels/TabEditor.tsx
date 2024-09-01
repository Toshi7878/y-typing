import { Box, Card, CardBody, Flex, useTheme } from "@chakra-ui/react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LineEdit, ThemeColors } from "@/types";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";

import { EditorButtonsRef, EditorTabRef } from "@/app/edit/ts/type";
import {
  useEditAddLyricsInputAtom,
  useEditLineLyricsAtom,
  useEditWordConvertOptionAtom,
  useLineInputReducer,
  useSetEditAddLyricsInputAtom,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";
import EditorButtons from "./tab-editor-child/EditorButtons";
import EditorLineInput from "./tab-editor-child/EditorLineInput";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import EditorAddLyricsInput from "./tab-editor-child/EditorAddLyricsInput";
import AddTimeAdjust from "./tab-settings-child/settings-child/AddTimeAdjust";

const TabEditor = forwardRef<EditorTabRef, unknown>((props, ref) => {
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const theme: ThemeColors = useTheme();

  const editorButtonsRef = useRef<EditorButtonsRef>(null);

  const { editorTimeInputRef, setRef } = useRefs();
  const lyrics = useEditLineLyricsAtom();
  const lyricsText = useEditAddLyricsInputAtom();
  const setLyricsText = useSetEditAddLyricsInputAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const lineInputReducer = useLineInputReducer();
  const convertOption = useEditWordConvertOptionAtom();

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("editorTabRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lyricsText, lyrics, convertOption]);

  useImperativeHandle(ref, () => ({
    undoAddLyrics: (undoLine: LineEdit) => {
      TextAreaEvents.undoTopLyrics(lineInputReducer, setLyricsText, undoLine, lyricsText);
      editorTimeInputRef.current!.undoAdd(undoLine.time);
    },

    redoAddLyrics: () => {
      TextAreaEvents.deleteTopLyrics(
        lineInputReducer,
        setLyricsText,
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

          <Flex justifyContent="space-between" alignItems="flex-end">
            <EditorButtons ref={editorButtonsRef} isTimeInputValid={isTimeInputValid} />
            <AddTimeAdjust />
          </Flex>

          <EditorAddLyricsInput />
        </Box>
      </CardBody>
    </Card>
  );
});

TabEditor.displayName = "EditorTab";

export default TabEditor;
