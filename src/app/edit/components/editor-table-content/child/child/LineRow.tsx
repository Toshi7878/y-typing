"use client";
import { Tr, Td, Button, useTheme, Input, Box, UseDisclosureReturn, Flex } from "@chakra-ui/react";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { LineEdit, ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import {
  useEditDirectEditCountAtom,
  useEditLineLyricsAtom,
  useEditLineSelectedCountAtom,
  useEditLineWordAtom,
  useEditTimeCountAtom,
  useIsLoadWordConvertAtom,
  useLineInputReducer,
  useSetEditDirectEditCountAtom,
  useSetEditLineLyricsAtom,
  useSetEditLineSelectedCountAtom,
  useSetEditLineWordAtom,
  useSetTabIndexAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useAddRubyTagEvent } from "@/app/edit/hooks/useEditKeyDownEvents";
import parse from "html-react-parser";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import {
  useIsConvertButtonDisabled,
  useLineUpdateButtonEvent,
  useWordConvertButtonEvent,
} from "@/app/edit/hooks/useEditorButtonEvents";

interface LineRowProps {
  index: number;
  line: LineEdit;
  optionClosure: UseDisclosureReturn;
  setOptionModalIndex: Dispatch<number>;
  setLineOptions: Dispatch<LineEdit["options"]>;
  endAfterLineIndex: number;
}

function LineRow({
  line,
  index,
  optionClosure,
  setOptionModalIndex,
  setLineOptions,
  endAfterLineIndex,
}: LineRowProps) {
  const [editTime, setEditTime] = useState(line.time);
  const directEditTimeInputRef = useRef<HTMLInputElement | null>(null);
  const directEditLyricsInputRef = useRef<HTMLInputElement | null>(null);
  const directEditWordInputRef = useRef<HTMLInputElement | null>(null);
  const setTabIndex = useSetTabIndexAtom();
  const [isLineLyricsSelected, setIsLineLyricsSelected] = useState(false);
  const lineSelectedCount = useEditLineSelectedCountAtom();
  const setLineSelectedCount = useSetEditLineSelectedCountAtom();
  const lineInputReducer = useLineInputReducer();
  const setLyrics = useSetEditLineLyricsAtom();
  const setWord = useSetEditLineWordAtom();
  const directEdit = useEditDirectEditCountAtom();
  const setDirectEdit = useSetEditDirectEditCountAtom();
  const { editorTimeInputRef, playerRef } = useRefs();
  const timeCount = useEditTimeCountAtom();
  const theme: ThemeColors = useTheme();
  const isConvertButtonDisabled = useIsConvertButtonDisabled();
  const wordConvertButtonEvent = useWordConvertButtonEvent();
  const isLoadWordConvert = useIsLoadWordConvertAtom();

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const selectLyrics = useEditLineLyricsAtom();
  const selectWord = useEditLineWordAtom();

  const handleEnterAddRuby = useAddRubyTagEvent();
  const lineUpdateButtonEvent = useLineUpdateButtonEvent();

  const selectLine = useCallback(
    (event: React.MouseEvent<HTMLTableRowElement>, selectCount: number) => {
      const time = mapData[selectCount].time;
      const lyrics = mapData[selectCount].lyrics;
      const word = mapData[selectCount].word;

      if (directEdit === selectCount) {
        return null;
      } else if (directEdit) {
        lineUpdateButtonEvent();
      }

      if (event.ctrlKey && selectCount !== 0 && selectCount !== endAfterLineIndex) {
        setDirectEdit(selectCount);

        const cellClassName = (event.target as HTMLElement).classList[0];
        setTimeout(() => {
          if (cellClassName === "time-cell") {
            directEditTimeInputRef.current?.focus(); // フォーカスを設定
          } else if (cellClassName === "lyrics-cell") {
            directEditLyricsInputRef.current?.focus(); // フォーカスを設定
          } else if (cellClassName === "word-cell") {
            directEditWordInputRef.current?.focus(); // フォーカスを設定
          }
        }, 0);
      } else if (directEdit !== selectCount) {
        setDirectEdit(null);
      }

      setLineSelectedCount(selectCount);
      lineInputReducer({ type: "set", payload: { time, lyrics, word, selectCount } });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapData, directEdit, editTime, selectLyrics, selectWord, endAfterLineIndex],
  );

  const clickTimeCell = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    index: number,
  ) => {
    if (directEdit !== index) {
      const time = Number(event.currentTarget.textContent);
      playerRef.current.seekTo(time);
    }
  };

  useEffect(() => {
    if (directEdit === index) {
      setEditTime(line.time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directEdit]);

  return (
    <Tr
      key={index}
      id={`line_${index}`}
      data-line-index={index}
      cursor="pointer"
      position="relative"
      bg={
        lineSelectedCount === index
          ? theme.colors.primary.dark
          : timeCount === index && lineSelectedCount !== index
            ? `${theme.colors.secondary.light}40`
            : endAfterLineIndex < index && line.lyrics !== "end"
              ? `${theme.colors.error.light}35`
              : "transparent"
      }
      color={theme.colors.text.body}
      outline={lineSelectedCount === index ? "1px solid" : "none"}
      outlineColor={lineSelectedCount === index ? theme.colors.text.body : "none"}
      _hover={{
        bg:
          lineSelectedCount !== index
            ? `${theme.colors.primary.dark}50`
            : theme.colors.primary.dark,
      }}
      onClick={(event) => {
        selectLine(event, index);
        setTabIndex(1);
      }}
      className={lineSelectedCount === index ? "selected-line" : ""}
    >
      <Td
        borderRight="1px solid black"
        className="time-cell hover:bg-cyan-700/35"
        onClick={(event) => clickTimeCell(event, index)}
        px={directEdit === index ? 2 : 4}
      >
        {directEdit === index ? (
          <CustomToolTip tooltipLabel={"↓↑: 0.05ずつ調整, Enter:再生"} placement="top">
            <Input
              ref={directEditTimeInputRef}
              size="xs"
              type="number"
              value={editTime}
              bg={theme.colors.background.body}
              borderColor={`${theme.colors.border.card}60`}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditTime(newValue);
                editorTimeInputRef.current!.setTime(newValue);
              }}
              onKeyDown={(e) => {
                const value = e.currentTarget.value;

                if (e.code === "ArrowUp") {
                  const newValue = (Number(value) - 0.05).toFixed(3);
                  setEditTime(newValue);
                  editorTimeInputRef.current!.setTime(newValue);
                  e.preventDefault();
                } else if (e.code === "ArrowDown") {
                  const newValue = (Number(value) + 0.05).toFixed(3);
                  setEditTime(newValue);
                  editorTimeInputRef.current!.setTime(newValue);
                  e.preventDefault();
                } else if (e.code === "Enter") {
                  playerRef.current.seekTo(Number(value));
                }
              }}
            />
          </CustomToolTip>
        ) : (
          line.time
        )}
      </Td>
      <Td className="lyrics-cell" borderRight="1px solid black">
        {directEdit === index ? (
          <CustomToolTip
            tooltipLabel={<Box fontSize="xs">Enterキーを押すとRubyタグを挿入できます。</Box>}
            placement="top"
            isDisabled={!isLineLyricsSelected}
            isOpen={isLineLyricsSelected}
          >
            <Input
              ref={directEditLyricsInputRef}
              size="sm"
              autoComplete="off"
              value={selectLyrics}
              onKeyDown={handleEnterAddRuby}
              bg={theme.colors.background.body}
              borderColor={`${theme.colors.border.card}60`}
              onChange={(e) => setLyrics(e.target.value)}
              onSelect={(e) => {
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const isSelected = end !== null && start !== null && end - start > 0;
                setIsLineLyricsSelected(isSelected);
              }}
              onBlur={() => setIsLineLyricsSelected(false)}
            />
          </CustomToolTip>
        ) : (
          parse(line.lyrics)
        )}
      </Td>
      <Td className="word-cell" borderRight="1px solid black">
        {directEdit === index ? (
          <Flex alignItems="center" justifyContent="space-between">
            <Button
              isDisabled={isConvertButtonDisabled}
              isLoading={isLoadWordConvert}
              variant="outline"
              size="sm"
              height="35px"
              width="8%"
              color={theme.colors.text.body}
              _hover={{ bg: `${theme.colors.secondary.main}60` }}
              borderColor={theme.colors.secondary.main}
              onClick={wordConvertButtonEvent}
            >
              変換
            </Button>
            <Input
              ref={directEditWordInputRef}
              width="91%"
              size="sm"
              autoComplete="off"
              value={selectWord}
              bg={theme.colors.background.body}
              borderColor={`${theme.colors.border.card}60`}
              onChange={(e) => setWord(e.target.value)}
            />
          </Flex>
        ) : (
          line.word
        )}
      </Td>
      <Td>
        <Button
          disabled={mapData.length - 1 === index}
          variant={line.options ? "solid" : "outline"}
          colorScheme="green"
          size="sm"
          onClick={() => {
            if (mapData.length - 1 !== index) {
              setOptionModalIndex(index);
              setLineOptions(line.options);
              optionClosure.onOpen();
            }
          }}
        >
          {line.options ? "設定有" : "未設定"}
        </Button>
      </Td>
    </Tr>
  );
}

export default LineRow;
