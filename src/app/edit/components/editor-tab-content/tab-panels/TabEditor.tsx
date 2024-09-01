import { Input, Box, Textarea, Card, CardBody, useTheme } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import EditorTimeInput from "./tab-editor-child/EditorTimeInput";
import { Line, ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";

import {
  EditorButtonsRef,
  EditorSettingsRef,
  EditorTabRef,
  SetLineFunctions,
  TimeInputRef,
} from "@/app/edit/ts/type";
import { useAtom } from "jotai";
import {
  editAddLyricsTextBoxAtom,
  editLineLyricsAtom,
  editLineSelectedNumberAtom as editSelectedLineCountAtom,
  editLineWordAtom,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";
import EditorButtons from "./tab-editor-child/EditorButtons";

// 後でリファクタリング

const TabEditor = forwardRef<EditorTabRef, unknown>((props, ref) => {
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const theme: ThemeColors = useTheme();

  const timeInputRef = useRef<TimeInputRef | null>(null);
  const editorSettingRef = useRef<EditorSettingsRef | null>(null);
  const editorButtonsRef = useRef<EditorButtonsRef>(null);

  const [selectedLineCount, setSelectedLineCount] = useAtom(editSelectedLineCountAtom);
  const [lyrics, setLyrics] = useAtom(editLineLyricsAtom);
  const [word, setWord] = useAtom(editLineWordAtom);
  const [lyricsText, setLyricsText] = useAtom(editAddLyricsTextBoxAtom);

  const setLineFunctions: SetLineFunctions = { setLyrics, setWord, setLyricsText };
  const mapData = useSelector((state: RootState) => state.mapData.value);

  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();

  const lineInit = () => {
    setLyrics("");
    setWord("");
    setSelectedLineCount(null);

    timeInputRef.current!.clearTime();
  };

  useEffect(() => {
    if (selectedLineCount !== null && mapData[selectedLineCount]) {
      const line = mapData[selectedLineCount];

      setLyrics(line.lyrics || "");
      setWord(line.word || "");
      timeInputRef.current!.selectedTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLineCount, mapData]);

  const setAddLyrics = (e: React.ChangeEvent<HTMLTextAreaElement> | null) => {
    setLyricsText(e!.target.value);
    const lines = (e ? (e.target as HTMLTextAreaElement).value : lyricsText).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.setTopLyrics(setLineFunctions, topLyrics, setIsLoadWordConvert, convertOption);
    }
  };

  useImperativeHandle(ref, () => ({
    undoAddLyrics: (undoLine: Line) => {
      TextAreaEvents.undoTopLyrics(setLineFunctions, undoLine, lyricsText);
      timeInputRef.current!.undoAdd(undoLine.time);
    },

    setAddLyrics: () => {
      setAddLyrics(null);
    },

    lineInit: () => {
      lineInit();
    },

    redoAddLyrics: () => {
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.deleteTopLyrics(
        setLineFunctions,
        lyrics,
        lyricsText,
        setIsLoadWordConvert,
        convertOption,
      );
    },

    getVolume: () => {
      return editorSettingRef.current?.getVolume() ?? 50;
    },
  }));

  return (
    <Card variant="filled" bg={theme.colors.card.bg} boxShadow="lg" color={theme.colors.card.color}>
      <CardBody py={4}>
        <form className="flex flex-col gap-y-1">
          <Box display="flex" alignItems="center">
            <EditorTimeInput ref={timeInputRef} onFormStateChange={setIsTimeInputValid} />
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
          <EditorButtons ref={editorButtonsRef} isTimeInputValid={isTimeInputValid} />
          <Box display="flex" alignItems="center">
            <Textarea
              placeholder="ここから歌詞をまとめて追加できます"
              size="lg"
              style={{ height: "110px" }}
              value={lyricsText}
              onPaste={() => {
                const convertOption = editorSettingRef.current!.getWordConvertOption();
                TextAreaEvents.paste(setLineFunctions, setIsLoadWordConvert, convertOption);
              }}
              onChange={(e) => setAddLyrics(e)}
            />
          </Box>
        </form>
      </CardBody>
    </Card>
  );
});

TabEditor.displayName = "EditorTab";

export default TabEditor;
