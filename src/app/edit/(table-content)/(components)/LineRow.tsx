"use client";
import { Tr, Td, Button } from "@chakra-ui/react";
import { SetStateAction, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../(redux)/store";
import { handleKeydown } from "../../(ts)/windowKeyDown";
import { useRefs } from "../../(contexts)/refsProvider";
import { addLine, updateLine } from "../../(redux)/mapDataSlice";
import { setSelectedIndex, setTimeIndex } from "../../(redux)/lineIndexSlice";
import { timer } from "../../(youtube-content)/timer";
import { setTabIndex } from "../../(redux)/tabIndexSlice";

export default function LineRow() {
  console.log("Table");
  const dispatch = useDispatch();
  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const timeIndex = useSelector((state: RootState) => state.lineIndex.timeIndex);
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const lastAddedTime = useSelector((state: RootState) => state.mapData.lastAddedTime);
  const playerState = useSelector((state: RootState) => state.ytState);
  const undoredoState = useSelector((state: RootState) => state.undoRedo);
  const refs = useRefs();
  const keydownHandler = useCallback(
    (event: KeyboardEvent) =>
      handleKeydown(event, refs, dispatch, playerState, undoredoState, mapData),
    [dispatch, playerState, refs, undoredoState, mapData]
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
  }, [mapData, lastAddedTime]);

  useEffect(() => {
    if (isStarted) {
      const duration = refs.playerRef.current?.getDuration();

      if (mapData[mapData.length - 1].lyrics !== "end") {
        dispatch(addLine({ time: duration.toFixed(3), lyrics: "end", word: "" }));
      } else {
        dispatch(
          updateLine({
            time: duration.toFixed(3),
            lyrics: "end",
            word: "",
            lineNumber: (mapData.length - 1).toString(),
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted]);

  const selectLine = (index: SetStateAction<number | null>) => {
    dispatch(setSelectedIndex(index));
  };
  useEffect(() => {
    const updateTimeBg = () => {
      if (timeIndex !== null) {
        if (
          mapData[timeIndex + 1] &&
          Number(timer.currentTime) >= Number(mapData[timeIndex + 1]["time"])
        ) {
          dispatch(setTimeIndex(timeIndex + 1));
        }
      } else {
        dispatch(setTimeIndex(0));
      }
    };

    timer.addListener(updateTimeBg);
    return () => {
      timer.removeListener(updateTimeBg);
    };
  }, [timeIndex, mapData, dispatch]);
  const clickTimeCell = (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    const time = Number(event.currentTarget.textContent);
    refs.playerRef.current.seekTo(time);
  };

  return (
    <>
      {mapData.map((line, index) => (
        <Tr
          key={index}
          id={`line_${index}`}
          data-line-index={index}
          className={`cursor-pointer relative ${
            selectedIndex === index
              ? "selected-line bg-cyan-400 outline outline-2 outline-black"
              : " hover:bg-cyan-400/35"
          } ${timeIndex === index && selectedIndex !== index ? " bg-teal-400/35" : ""}`}
          onClick={() => {
            selectLine(index);
            dispatch(setTabIndex(1));
          }}
        >
          <Td
            borderRight="1px solid black"
            className="time-cell hover:bg-cyan-700/35"
            onClick={clickTimeCell}
          >
            {line.time}
          </Td>
          <Td borderRight="1px solid black">{line.lyrics}</Td>
          <Td borderRight="1px solid black">{line.word}</Td>
          <Td>
            <Button
              disabled={mapData.length - 1 === index}
              variant="outline"
              colorScheme={`${selectedIndex === index ? "green" : "cyan"}`}
              size="sm"
            >
              オプション
            </Button>
          </Td>
        </Tr>
      ))}
    </>
  );
}
