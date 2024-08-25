/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Box, Textarea, Flex, Button, Card, CardBody, useTheme } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import EditorTimeInput from "./tab-editor-child/EditorTimeInput";
import EditorSettingModal from "./tab-editor-child/EditorSettingModal";
import { Line, ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { setLastAddedTime } from "@/app/edit/redux/mapDataSlice";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";
import { ButtonEvents } from "@/app/edit/ts/tab/editor/buttonEvent";
import { setCanUpload, setIsLoadingWordConvertBtn } from "@/app/edit/redux/buttonFlagsSlice";
import { addHistory } from "@/app/edit/redux/undoredoSlice";
import { EditorSettingsRef, SetLineFunctions, TimeInputRef } from "@/app/edit/ts/type";
import { useAtom } from "jotai";
import {
  editAddLyricsTextBoxAtom,
  editLineLyricsAtom,
  editLineSelectedNumberAtom,
  editLineWordAtom,
} from "@/app/edit/edit-atom/editAtom";

// 後でリファクタリング

const TabEditor = forwardRef((props, ref) => {
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const theme: ThemeColors = useTheme();
  const timeInputRef = useRef<TimeInputRef | null>(null);
  const editorSettingRef = useRef<EditorSettingsRef | null>(null);

  const [lineNumber, setLineNumber] = useAtom(editLineSelectedNumberAtom);
  const [lyrics, setLyrics] = useAtom(editLineLyricsAtom);
  const [word, setWord] = useAtom(editLineWordAtom);
  const [lyricsText, setLyricsText] = useAtom(editAddLyricsTextBoxAtom);

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
  const isLoadingWordConvertBtn = useSelector(
    (state: RootState) => state.btnFlags.isLoadingWordConvertBtn,
  );

  const lineInit = () => {
    setLyrics("");
    setWord("");
    setLineNumber(null);

    timeInputRef.current!.clearTime();
  };

  useEffect(() => {
    if (lineNumber !== null && mapData[lineNumber]) {
      const line = mapData[lineNumber];

      setLyrics(line.lyrics || "");
      setWord(line.word || "");
      timeInputRef.current!.selectedTime();
    }
  }, [lineNumber, mapData]);

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
    const timeOffset = editorSettingRef.current!.getTimeOffset();
    const time = timeValidate(timeInputRef.current!.getTime() + timeOffset, mapData).toFixed(3);
    const addLyrics = lyricsText;

    const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
    dispatch(setLastAddedTime(time));
    ButtonEvents.addLine(dispatch, { time, lyrics, word });

    if (!isShiftKey) {
      lineInit();
    }
    const convertOption = editorSettingRef.current!.getWordConvertOption();

    TextAreaEvents.deleteTopLyrics(
      setLineFunctions,
      lyricsCopy,
      addLyrics,
      dispatch,
      convertOption,
    );
  };

  const update = (mapData: RootState["mapData"]["value"]) => {
    const time = timeValidate(timeInputRef.current!.getTime(), mapData).toFixed(3);

    dispatch(setCanUpload(true));
    dispatch(
      addHistory({
        type: "update",
        data: { old: mapData[lineNumber!], new: { time, lyrics, word }, lineNumber },
      }),
    );

    ButtonEvents.updateLine(dispatch, {
      time,
      lyrics,
      word,
      lineNumber: lineNumber ?? undefined,
    });
    lineInit();
  };

  const wordConvert = async () => {
    const convertOption = editorSettingRef.current!.getWordConvertOption();

    dispatch(setIsLoadingWordConvertBtn(true));
    await ButtonEvents.lyricsConvert(lyrics, setLineFunctions, convertOption);
    dispatch(setIsLoadingWordConvertBtn(false));
  };

  const deleteLine = (mapData: RootState["mapData"]["value"]) => {
    if (lineNumber) {
      ButtonEvents.deleteLine(dispatch, { ...mapData[lineNumber], lineNumber });
    }
    lineInit();
  };

  const setAddLyrics = (e: React.ChangeEvent<HTMLTextAreaElement> | null) => {
    setLyricsText(e!.target.value);
    const lines = (e ? (e.target as HTMLTextAreaElement).value : lyricsText).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.setTopLyrics(setLineFunctions, topLyrics, dispatch, convertOption);
    }
  };

  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const updateButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  const isLastLineSelected = lineNumber === endAfterLineIndex;
  const isNotSelect = !lineNumber || lineNumber === 0;
  const buttonConfigs = {
    add: {
      isDisabled: !isTimeInputValid,
      colorScheme: "teal",
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

      colorScheme: "cyan",
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
      isLoading: isLoadingWordConvertBtn,
      colorScheme: "blue",
      onClick: wordConvert,
      text: "読み変換",
    },
    delete: {
      isDisabled: !isTimeInputValid || isNotSelect || isLastLineSelected,
      ref: deleteButtonRef,

      colorScheme: "red",
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

    redoAddLyrics: (redoLine: Line) => {
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.deleteTopLyrics(setLineFunctions, lyrics, lyricsText, dispatch, convertOption);
    },

    getVolume: () => {
      return editorSettingRef.current?.getVolume();
    },
  }));

  return (
    <Card variant="filled" bg={theme.colors.card.bg} boxShadow="lg" color={theme.colors.card.color}>
      <CardBody>
        <form className="flex flex-col gap-y-1">
          <Box display="flex" alignItems="center">
            <EditorTimeInput ref={timeInputRef} onFormStateChange={setIsTimeInputValid} />
            <Input placeholder="歌詞" size="sm" autoComplete="off" value={lyrics} />
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
              value={lineNumber ?? ""}
            />
            <Input placeholder="ワード" size="sm" autoComplete="off" value={word} />
          </Box>
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
                  colorScheme={config.colorScheme}
                  _hover={{ bg: `${config.colorScheme}.100` }}
                  onClick={config.onClick}
                >
                  {config.text}
                </Button>
              ))}
              <EditorSettingModal ref={editorSettingRef} />
            </Flex>
          </Box>
          <Box display="flex" alignItems="center">
            <Textarea
              placeholder="ここから歌詞をまとめて追加できます"
              size="lg"
              style={{ height: "110px" }}
              value={lyricsText}
              onPaste={() => {
                const convertOption = editorSettingRef.current!.getWordConvertOption();
                TextAreaEvents.paste(setLineFunctions, dispatch, convertOption);
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
