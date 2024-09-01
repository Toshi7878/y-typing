import { Box, Flex, Button, useTheme } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { setLastAddedTime } from "@/app/edit/redux/mapDataSlice";
import { TextAreaEvents } from "@/app/edit/ts/tab/editor/textAreaEvent";
import { ButtonEvents } from "@/app/edit/ts/tab/editor/buttonEvent";
import { addHistory } from "@/app/edit/redux/undoredoSlice";
import { EditorButtonsRef } from "@/app/edit/ts/type";
import { useAtomValue } from "jotai";
import {
  isEditYouTubePlayingAtom,
  useSetCanUploadAtom,
  useIsLoadWordConvertAtom,
  useSetIsLoadWordConvertAtom,
  useEditLineSelectedCountAtom,
  useEditLineLyricsAtom,
  useEditLineWordAtom,
  useLineInputReducer,
  useEditAddLyricsInputAtom,
  useSetEditAddLyricsInputAtom,
  useEditAddTimeOffsetAtom,
  useEditWordConvertOptionAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";

interface EditorButtonsProps {
  isTimeInputValid: boolean;
}
const EditorButtons = forwardRef<EditorButtonsRef, EditorButtonsProps>((props, ref) => {
  const { editorTimeInputRef, setRef } = useRefs();
  const theme: ThemeColors = useTheme();

  const selectedLineCount = useEditLineSelectedCountAtom();
  const lyrics = useEditLineLyricsAtom();
  const word = useEditLineWordAtom();
  const lineInputReducer = useLineInputReducer();

  const lyricsText = useEditAddLyricsInputAtom();
  const setLyricsText = useSetEditAddLyricsInputAtom();
  const isYTPlaying = useAtomValue(isEditYouTubePlayingAtom);
  const addTimeOffset = useEditAddTimeOffsetAtom();
  const convertOption = useEditWordConvertOptionAtom();

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

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("editorButtonsRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const timeOffset = isYTPlaying ? addTimeOffset : 0;
    const time = timeValidate(editorTimeInputRef.current!.getTime() + timeOffset, mapData).toFixed(
      3,
    );
    const addLyrics = lyricsText;

    const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
    dispatch(setLastAddedTime(time));
    ButtonEvents.addLine(dispatch, setCanUpload, { time, lyrics, word });

    if (!isShiftKey) {
      lineInputReducer({ type: "reset" });
    }

    TextAreaEvents.deleteTopLyrics(
      lineInputReducer,
      setLyricsText,
      lyricsCopy,
      addLyrics,
      setIsLoadWordConvert,
      convertOption,
    );
  };

  const update = (mapData: RootState["mapData"]["value"]) => {
    const time = timeValidate(editorTimeInputRef.current!.getTime(), mapData).toFixed(3);

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
    lineInputReducer({ type: "reset" });
  };

  const wordConvert = async () => {
    setIsLoadWordConvert(true);
    const word = await ButtonEvents.lyricsConvert(lyrics, convertOption);
    setIsLoadWordConvert(false);
    lineInputReducer({ type: "set", payload: { word } });
  };

  const deleteLine = (mapData: RootState["mapData"]["value"]) => {
    if (selectedLineCount) {
      ButtonEvents.deleteLine(dispatch, setCanUpload, {
        ...mapData[selectedLineCount],
        selectedLineCount: selectedLineCount,
      });
    }
    lineInputReducer({ type: "reset" });
  };

  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const updateButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  const isLastLineSelected = selectedLineCount === endAfterLineIndex;
  const isNotSelect = !selectedLineCount || selectedLineCount === 0;
  const buttonConfigs = {
    add: {
      isDisabled: !props.isTimeInputValid,
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
      isDisabled: !props.isTimeInputValid || isNotSelect || isLastLineSelected,
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
      isDisabled: !props.isTimeInputValid || isNotSelect || isLastLineSelected,
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
            className="w-[16%]  md:w-[18%]"
            color={theme.colors.card.color}
            bg={theme.colors.background}
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
