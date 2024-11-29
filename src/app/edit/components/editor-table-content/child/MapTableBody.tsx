"use client";
import {
  useEditAddLyricsTextAtom,
  useEditDirectEditCountAtom,
  useEditLineLyricsAtom,
  useEditLineSelectedCountAtom,
  useEditLineWordAtom,
  useEditTimeCountAtom,
  useIsEditYTPlayingAtom,
  useIsEditYTStartedAtom,
  useSetEditCustomStyleLengthAtom,
  useSetEditTimeCountAtom,
  useSpeedAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { useWindowKeydownEvent } from "@/app/edit/hooks/useEditKeyDownEvents";
import {
  useIsAddButtonDisabled,
  useIsDeleteButtonDisabled,
  useIsUpdateButtonDisabled,
} from "@/app/edit/hooks/useEditorButtonEvents";
import { setMapData, updateLine } from "@/app/edit/redux/mapDataSlice";
import { RootState } from "@/app/edit/redux/store";
import { timer } from "@/app/edit/ts/youtube-ts/editTimer";
import { MapData } from "@/app/type/ts/type";
import { ThemeColors } from "@/types";
import { useDisclosure, useTheme } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LineRow from "./child/LineRow";
import LineOptionModal from "./LineOptionModal";

function MapTableBody() {
  const dispatch = useDispatch();
  const optionClosure = useDisclosure();
  const [optionModalIndex, setOptionModalIndex] = useState<number | null>(null);

  const [lineOptions, setLineOptions] = useState<MapData["options"] | null>(null);
  const lineSelectedCount = useEditLineSelectedCountAtom();
  const setTimeCount = useSetEditTimeCountAtom();
  const setCustomStyleLength = useSetEditCustomStyleLengthAtom();
  const timeCount = useEditTimeCountAtom();
  const isYTStarted = useIsEditYTStartedAtom();
  const lastAddedTime = useSelector((state: RootState) => state.mapData.lastAddedTime);
  const { tbodyRef, playerRef } = useRefs();
  const theme: ThemeColors = useTheme();
  const windowKeydownEvent = useWindowKeydownEvent();

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const undoredoState = useSelector((state: RootState) => state.undoRedo);
  const speed = useSpeedAtom();
  const isYTPlaying = useIsEditYTPlayingAtom();
  const selectLyrics = useEditLineLyricsAtom();
  const selectWord = useEditLineWordAtom();

  const addLyricsText = useEditAddLyricsTextAtom();
  const isAddButtonDisabled = useIsAddButtonDisabled();
  const isUpdateButtonDisabled = useIsUpdateButtonDisabled();
  const isDeleteButtonDisabled = useIsDeleteButtonDisabled();
  const directEdit = useEditDirectEditCountAtom();

  useEffect(() => {
    window.addEventListener("keydown", windowKeydownEvent);
    return () => {
      window.removeEventListener("keydown", windowKeydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapData,
    undoredoState,
    speed,
    isYTPlaying,
    selectLyrics,
    addLyricsText,
    isAddButtonDisabled,
    isUpdateButtonDisabled,
    isDeleteButtonDisabled,
    directEdit,
  ]);

  useEffect(() => {
    if (mapData.length > 0) {
      for (let i = mapData.length - 1; i >= 0; i--) {
        if (Number(mapData[i]["time"]) == Number(lastAddedTime)) {
          const targetRow = tbodyRef.current?.children[i];

          if (targetRow && targetRow instanceof HTMLElement) {
            const parentElement = targetRow.parentElement!.parentElement!.parentElement;
            if (parentElement && targetRow instanceof HTMLElement) {
              parentElement.scrollTo({
                top: targetRow.offsetTop - parentElement.offsetTop - targetRow.offsetHeight,
                behavior: "smooth",
              });
            }
          }

          break;
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAddedTime]);

  useEffect(() => {
    if (isYTStarted) {
      const duration = playerRef.current?.getDuration();

      if (duration) {
        for (let i = mapData.length - 1; i >= 0; i--) {
          if (mapData[i].lyrics === "end") {
            dispatch(
              updateLine({
                time: duration.toFixed(3),
                lyrics: "end",
                word: "",
                selectedLineCount: i,
              }),
            );

            return;
          }
        }

        const addLineMap = [
          ...mapData,
          { time: duration.toFixed(3), lyrics: "end", word: "" },
        ].sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
        dispatch(setMapData(addLineMap));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYTStarted]);

  useEffect(() => {
    const updateTimeBg = (currentTime: string) => {
      const nextLine = mapData[timeCount + 1];
      if (nextLine && Number(currentTime) >= Number(nextLine["time"])) {
        setTimeCount(timeCount + 1);
      }
    };

    timer.addListener(updateTimeBg);
    return () => {
      timer.removeListener(updateTimeBg);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeCount, mapData]);

  const renderedRows = useMemo(
    () => {
      let customStyleLength = 0;
      const endAfterLineIndex = mapData.findIndex((line) => line.lyrics === "end");

      const rows = mapData.map((line, index) => {
        const eternalCSS = line.options?.eternalCSS;
        const changeCSS = line.options?.changeCSS;
        if (eternalCSS) {
          customStyleLength += eternalCSS.length;
        }

        if (changeCSS) {
          customStyleLength += changeCSS.length;
        }

        return (
          <LineRow
            key={index}
            index={index}
            line={line}
            optionClosure={optionClosure}
            setLineOptions={setLineOptions}
            setOptionModalIndex={setOptionModalIndex}
            endAfterLineIndex={endAfterLineIndex}
          />
        );
      });

      setCustomStyleLength(customStyleLength);

      return rows;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapData, lineSelectedCount, timeCount, theme, directEdit, selectLyrics, selectWord],
  );

  return (
    <>
      {renderedRows}

      {optionClosure.isOpen && (
        <LineOptionModal
          isOpen={optionClosure.isOpen}
          onClose={optionClosure.onClose}
          optionModalIndex={optionModalIndex}
          lineOptions={lineOptions}
        />
      )}
    </>
  );
}

export default MapTableBody;
