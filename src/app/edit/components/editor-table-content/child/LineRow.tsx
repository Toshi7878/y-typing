"use client";
import { Tr, Td, Button, useDisclosure } from "@chakra-ui/react";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LineOptionModal from "./LineOptionModal";
import { Line } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { handleKeydown } from "@/app/edit/ts/windowKeyDown";
import { addLine, updateLine } from "@/app/edit/redux/mapDataSlice";
import { timer } from "@/app/edit/ts/youtube-ts/editTimer";
import {
  editLineSelectedNumberAtom,
  editLineTimeAtom,
  editSpeedAtom,
  editTabIndexAtom,
  editTimeCountAtom,
  isEditYouTubePlayingAtom,
  isEditYouTubeStartedAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export default function LineRow() {
  console.log("Table");
  const setTabIndex = useSetAtom(editTabIndexAtom);

  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [optionModalIndex, setOptionModalIndex] = useState<number | null>(null);
  const [lineOptions, setLineOptions] = useState<Line["options"] | null>(null);
  const [speed, setSpeed] = useAtom(editSpeedAtom);
  const isYTPlaying = useAtomValue(isEditYouTubePlayingAtom);
  const [lineNumber, setLineNumber] = useAtom(editLineSelectedNumberAtom);
  const [timeCount, setTimeCount] = useAtom(editTimeCountAtom);
  const isYTStarted = useAtomValue(isEditYouTubeStartedAtom);

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const lastAddedTime = useSelector((state: RootState) => state.mapData.lastAddedTime);
  const undoredoState = useSelector((state: RootState) => state.undoRedo);
  const refs = useRefs();
  const keydownHandler = useCallback(
    (event: KeyboardEvent) =>
      handleKeydown(
        event,
        refs,
        undoredoState,
        dispatch,
        mapData,
        speed,
        setSpeed,
        isYTPlaying,
        setLineNumber,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refs, undoredoState, mapData, speed],
  );

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  useEffect(() => {
    if (mapData.length > 0) {
      for (let i = mapData.length - 1; i >= 0; i--) {
        if (Number(mapData[i]["time"]) == Number(lastAddedTime)) {
          const targetRow = refs.tbodyRef.current?.children[i];

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
      const duration = refs.playerRef.current?.getDuration();

      if (duration) {
        if (mapData[mapData.length - 1].lyrics !== "end") {
          dispatch(addLine({ time: duration.toFixed(3), lyrics: "end", word: "" }));
        } else {
          dispatch(
            updateLine({
              time: duration.toFixed(3),
              lyrics: "end",
              word: "",
              lineNumber: (mapData.length - 1).toString(),
            }),
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYTStarted]);

  const selectLine = (index: SetStateAction<number | null>) => {
    setLineNumber(index);
  };
  useEffect(() => {
    const updateTimeBg = () => {
      if (timeCount !== null) {
        if (
          mapData[timeCount + 1] &&
          Number(timer.currentTime) >= Number(mapData[timeCount + 1]["time"])
        ) {
          setTimeCount(timeCount);
        }
      } else {
        setTimeCount(null);
      }
    };

    timer.addListener(updateTimeBg);
    return () => {
      timer.removeListener(updateTimeBg);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeCount, mapData]);
  const clickTimeCell = (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    const time = Number(event.currentTarget.textContent);
    refs.playerRef.current.seekTo(time);
  };
  const endAfterLineIndex = mapData.findIndex((line) => line.lyrics === "end");

  return (
    <>
      {mapData.map((line, index) => (
        <Tr
          key={index}
          id={`line_${index}`}
          data-line-index={index}
          className={`cursor-pointer relative ${
            lineNumber === index
              ? "selected-line bg-cyan-300 outline outline-2 outline-black"
              : " hover:bg-cyan-400/35"
          } ${timeCount === index && lineNumber !== index ? " bg-teal-400/35" : ""} ${
            endAfterLineIndex < index && line.lyrics !== "end" ? " bg-red-400/35" : ""
          }
          `}
          onClick={() => {
            selectLine(index);
            setTabIndex(1);
          }}
        >
          <Td
            borderRight="1px solid black"
            className="time-cell hover:bg-cyan-700/35"
            onClick={clickTimeCell}
          >
            {line.time}
          </Td>
          <Td borderRight="1px solid black" dangerouslySetInnerHTML={{ __html: line.lyrics }}></Td>
          <Td borderRight="1px solid black">{line.word}</Td>
          <Td>
            <Button
              disabled={mapData.length - 1 === index}
              variant={line.options ? "solid" : "outline"}
              colorScheme={`${lineNumber === index ? "green" : "green"}`}
              size="sm"
              onClick={() => {
                if (mapData.length - 1 !== index) {
                  setOptionModalIndex(index);
                  setLineOptions(line.options);
                  onOpen();
                }
              }}
            >
              {line.options ? "設定有" : "未設定"}
            </Button>
          </Td>
        </Tr>
      ))}

      {isOpen && (
        <LineOptionModal
          isOpen={isOpen}
          onClose={onClose}
          optionModalIndex={optionModalIndex}
          lineOptions={lineOptions}
        />
      )}
    </>
  );
}
