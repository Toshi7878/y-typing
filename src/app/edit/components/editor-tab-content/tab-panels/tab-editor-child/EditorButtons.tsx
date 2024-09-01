import { Box, Flex, Button, useTheme } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { setLastAddedTime } from "@/app/edit/redux/mapDataSlice";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";
import { ButtonEvents } from "@/app/edit/ts/tab/editor/buttonEvent";
import { addHistory } from "@/app/edit/redux/undoredoSlice";
import { EditorSettingsRef, SetLineFunctions, TimeInputRef } from "@/app/edit/ts/type";
import { useAtom, useAtomValue } from "jotai";
import {
  editAddLyricsTextBoxAtom,
  editLineLyricsAtom,
  editLineSelectedNumberAtom as editSelectedLineCountAtom,
  editLineWordAtom,
  isEditYouTubePlayingAtom,
  useSetCanUploadAtom,
  useIsLoadWordConvertAtom,
  useSetIsLoadWordConvertAtom,
} from "@/app/edit/edit-atom/editAtom";

const EditorButtons = forwardRef((props, ref) => {
  const [isTimeInputValid] = useState(false);
  const theme: ThemeColors = useTheme();
  const timeInputRef = useRef<TimeInputRef | null>(null);
  const editorSettingRef = useRef<EditorSettingsRef | null>(null);

  const [selectedLineCount, setSelectedLineCount] = useAtom(editSelectedLineCountAtom);
  const [lyrics, setLyrics] = useAtom(editLineLyricsAtom);
  const [word, setWord] = useAtom(editLineWordAtom);
  const [lyricsText, setLyricsText] = useAtom(editAddLyricsTextBoxAtom);
  const isYTPlaying = useAtomValue(isEditYouTubePlayingAtom);

  const setLineFunctions: SetLineFunctions = { setLyrics, setWord, setLyricsText };
  const dispatch = useDispatch();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const endAfterLineIndex =
    mapData.length -
    1 -
    mapData
      .slice()
      .reverse()
      .findIndex((line) => line.lyrics === "end");

  const isLoadWordConvert = useIsLoadWordConvertAtom();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();

  const setCanUpload = useSetCanUploadAtom();

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

  const timeValidate = (time: number, mapData: RootState["mapData"]["value"]) => {
    const lastLineTime = Number(mapData[endAfterLineIndex]["time"]);

    if (0 >= time) {
      return 0.001;
    } else if (lastLineTime <= time) {
      return lastLineTime - 0.001;
    } else {
      return time;
    }
  };

  const add = (mapData: RootState["mapData"]["value"], isShiftKey: boolean) => {
    const timeOffset = isYTPlaying ? editorSettingRef.current!.getTimeOffset() : 0;
    const time = timeValidate(timeInputRef.current!.getTime() + timeOffset, mapData).toFixed(3);
    const addLyrics = lyricsText;

    const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
    dispatch(setLastAddedTime(time));
    ButtonEvents.addLine(dispatch, setCanUpload, { time, lyrics, word });

    if (!isShiftKey) {
      lineInit();
    }
    const convertOption = editorSettingRef.current!.getWordConvertOption();

    TextAreaEvents.deleteTopLyrics(
      setLineFunctions,
      lyricsCopy,
      addLyrics,
      setIsLoadWordConvert,
      convertOption,
    );
  };

  const update = (mapData: RootState["mapData"]["value"]) => {
    const time = timeValidate(timeInputRef.current!.getTime(), mapData).toFixed(3);

    setCanUpload(true);
    dispatch(
      addHistory({
        type: "update",
        data: {
          old: mapData[selectedLineCount!],
          new: { time, lyrics, word },
          lineNumber: selectedLineCount,
        },
      }),
    );

    ButtonEvents.updateLine(dispatch, {
      time,
      lyrics,
      word,
      selectedLineCount: selectedLineCount ?? undefined,
    });
    lineInit();
  };

  const wordConvert = async () => {
    const convertOption = editorSettingRef.current!.getWordConvertOption();

    setIsLoadWordConvert(true);
    await ButtonEvents.lyricsConvert(lyrics, setLineFunctions, convertOption);
    setIsLoadWordConvert(false);
  };

  const deleteLine = (mapData: RootState["mapData"]["value"]) => {
    if (selectedLineCount) {
      ButtonEvents.deleteLine(dispatch, setCanUpload, {
        ...mapData[selectedLineCount],
        selectedLineCount: selectedLineCount,
      });
    }
    lineInit();
  };

  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const updateButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  const isLastLineSelected = selectedLineCount === endAfterLineIndex;
  const isNotSelect = !selectedLineCount || selectedLineCount === 0;
  const buttonConfigs = {
    add: {
      isDisabled: !isTimeInputValid,
      colorScheme: theme.colors.edit.mapTable.currentTimeLine.bg,
      ref: addButtonRef,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        add(mapData, e.shiftKey);
        //フォーカスを外さないとクリック時にテーブルがスクロールされない
        (document.activeElement as HTMLElement)?.blur();
      },
      text: (
        <>
          追加<small className="hidden sm:inline">(S)</small>
        </>
      ),
      isLoading: false,
    },
    update: {
      isDisabled: !isTimeInputValid || isNotSelect || isLastLineSelected,
      ref: updateButtonRef,

      colorScheme: theme.colors.edit.mapTable.selectedLine.bg,
      onClick: () => {
        update(mapData);
      },
      text: (
        <>
          変更<small className="hidden sm:inline">(U)</small>
        </>
      ),
      isLoading: false,
    },
    wordConvert: {
      isDisabled: isLastLineSelected,
      ref: undefined,
      isLoading: isLoadWordConvert,
      colorScheme: theme.colors.edit.mapTable.selectedLine.bg,
      onClick: wordConvert,
      text: "読み変換",
    },
    delete: {
      isDisabled: !isTimeInputValid || isNotSelect || isLastLineSelected,
      ref: deleteButtonRef,

      colorScheme: theme.colors.edit.mapTable.errorLine.bg,
      onClick: () => {
        deleteLine(mapData);
      },
      text: (
        <>
          削除<small className="hidden sm:inline">(Del)</small>
        </>
      ),
      isLoading: false,
    },
  };

  useImperativeHandle(ref, () => ({
    add: () => {
      addButtonRef.current!.click();
    },
    update: () => {
      updateButtonRef.current!.click();
    },
    delete: () => {
      deleteButtonRef.current!.click();
    },
  }));

  return (
    <Box display="grid" gridTemplateColumns="1fr auto" gap="2" alignItems="center">
      <Flex gap="5">
        {Object.values(buttonConfigs).map((config, index) => (
          <Button
            key={index}
            ref={config.ref ? config.ref : undefined}
            isDisabled={config.isDisabled}
            isLoading={config.isLoading}
            variant="outline"
            size="sm"
            height="35px"
            className="w-[16%] xl:w-[12%] lg:w-[19%] md:w-[19%]"
            _hover={{ bg: `${config.colorScheme}80` }}
            borderColor={config.colorScheme}
            onClick={config.onClick}
            sx={{ colorScheme: config.colorScheme }}
          >
            {config.text}
          </Button>
        ))}
      </Flex>
    </Box>
  );
});

EditorButtons.displayName = "EditorButtons";

export default EditorButtons;
