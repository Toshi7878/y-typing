"use client";
import { Tr, Td, Button, useTheme, Input, Box, UseDisclosureReturn } from "@chakra-ui/react";
import { Dispatch, useCallback, useEffect, useState } from "react";
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
  useLineInputReducer,
  useSetEditDirectEditCountAtom,
  useSetEditLineLyricsAtom,
  useSetEditLineSelectedCountAtom,
  useSetEditLineWordAtom,
  useSetTabIndexAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useAddRubyTagEvent } from "@/app/edit/hooks/useEditKeyDownEvents";
import parse from "html-react-parser";
import CustomToolTip from "@/components/CustomToolTip";
import { useLineUpdateButtonEvent } from "@/app/edit/hooks/useEditorButtonEvents";

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

  const setTabIndex = useSetTabIndexAtom();
  const [isLineLyricsSelected, setIsLineLyricsSelected] = useState(false);
  const lineSelectedCount = useEditLineSelectedCountAtom();
  const setLineSelectedCount = useSetEditLineSelectedCountAtom();
  const lineInputReducer = useLineInputReducer();
  const setLyrics = useSetEditLineLyricsAtom();
  const setWord = useSetEditLineWordAtom();
  const directEdit = useEditDirectEditCountAtom();
  const setDirectEdit = useSetEditDirectEditCountAtom();
  const { editorTimeInputRef } = useRefs();
  const timeCount = useEditTimeCountAtom();
  const refs = useRefs();
  const theme: ThemeColors = useTheme();

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const selectLyrics = useEditLineLyricsAtom();
  const selectWord = useEditLineWordAtom();

  const handleEnterAddRuby = useAddRubyTagEvent();
  const lineUpdateButtonEvent = useLineUpdateButtonEvent();

  const selectLine = useCallback(
    (isCtrlKey: boolean, selectCount: number) => {
      const time = mapData[selectCount].time;
      const lyrics = mapData[selectCount].lyrics;
      const word = mapData[selectCount].word;

      if (directEdit === selectCount) {
        return null;
      } else if (directEdit) {
        lineUpdateButtonEvent();
      }

      if (isCtrlKey && selectCount !== 0 && selectCount !== endAfterLineIndex) {
        setDirectEdit(selectCount);
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
      refs.playerRef.current.seekTo(time);
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
          ? theme.colors.edit.mapTable.selectedLine.bg
          : timeCount === index && lineSelectedCount !== index
            ? `${theme.colors.edit.mapTable.currentTimeLine.bg}40`
            : endAfterLineIndex < index && line.lyrics !== "end"
              ? `${theme.colors.edit.mapTable.errorLine.bg}35`
              : "transparent"
      }
      color={theme.colors.color}
      outline={lineSelectedCount === index ? "1px solid" : "none"}
      outlineColor={lineSelectedCount === index ? theme.colors.color : "none"}
      _hover={{
        bg:
          lineSelectedCount !== index
            ? `${theme.colors.edit.mapTable.selectedLine.bg}50`
            : theme.colors.edit.mapTable.selectedLine.bg,
      }}
      onClick={(event) => {
        selectLine(event.ctrlKey, index);
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
          <Input
            size="xs"
            type="number"
            value={editTime}
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditTime(newValue);
              editorTimeInputRef.current!.setTime(newValue);
            }}
            onKeyDown={(e) => {
              const value = e.currentTarget.value;

              if (e.code === "ArrowDown") {
                const newValue = (Number(value) - 0.1).toFixed(3);
                setEditTime(newValue);
                editorTimeInputRef.current!.setTime(newValue);
                e.preventDefault();
              } else if (e.code === "ArrowUp") {
                const newValue = (Number(value) + 0.1).toFixed(3);
                setEditTime(newValue);
                editorTimeInputRef.current!.setTime(newValue);
                e.preventDefault();
              }
            }}
          />
        ) : (
          line.time
        )}
      </Td>
      <Td borderRight="1px solid black">
        {directEdit === index ? (
          <CustomToolTip
            tooltipLabel={<Box fontSize="xs">Enterキーを押すとRubyタグを挿入できます。</Box>}
            placement="top"
            isDisabled={!isLineLyricsSelected}
            isOpen={isLineLyricsSelected}
          >
            <Input
              size="sm"
              autoComplete="off"
              value={selectLyrics}
              onKeyDown={handleEnterAddRuby}
              bg={theme.colors.background}
              borderColor={`${theme.colors.card.borderColor}60`}
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
      <Td borderRight="1px solid black">
        {directEdit === index ? (
          <Input
            size="sm"
            autoComplete="off"
            value={selectWord}
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            onChange={(e) => setWord(e.target.value)}
          />
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
