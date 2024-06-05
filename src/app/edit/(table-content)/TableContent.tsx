/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { useMemo, SetStateAction, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "../(youtube-content)/playerProvider";
import { RootState } from "../(redux)/store";
import { addLine } from "../(redux)/mapDataSlice";
import { useFormContext } from "react-hook-form";
import { setSelectedIndex, setTimeIndex } from "../(redux)/lineIndexSlice";
import { timer } from "../(youtube-content)/timer";
import { InputFormSchema } from "../(contexts)/Schema";

export default function TableContent() {
  console.log("Table");

  const { setValue } = useFormContext();
  const { playerRef } = usePlayer();
  const dispatch = useDispatch();
  const playing = useSelector((state: RootState) => state.playing.value);
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const timeIndex = useSelector((state: RootState) => state.lineIndex.timeIndex);
  const mapData = useSelector(
    (state: RootState) => state.mapData.value,
    (left, right) => left === right
  );

  useEffect(() => {
    if (playing && mapData.length === 1) {
      const duration = Number(playerRef.current?.getDuration());
      dispatch(addLine({ time: duration, lyrics: "end", word: "" }));
    }
  }, [playerRef, playing, mapData, dispatch]);
  const selectLine = (line: InputFormSchema["EditorTab"], index: SetStateAction<number | null>) => {
    setValue("EditorTab.time", line.time);
    setValue("EditorTab.lyrics", line.lyrics);
    setValue("EditorTab.word", line.word);
    setValue("EditorTab.lineNumber", index);
    dispatch(setSelectedIndex(index));
  };

  // const updateRangeValue = () => {
  //   if (currentTimeRef.current !== timer.currentTime) {
  //     currentTimeRef.current = timer.currentTime;

  //     if (timeIndex !== null) {
  //       if (mapData[timeIndex + 1] && timer.currentTime >= mapData[timeIndex + 1]["time"]) {
  //         dispatch(setTimeIndex(timeIndex + 1));
  //       }
  //     } else {
  //       dispatch(setTimeIndex(0));
  //     }
  //   }
  // };

  // useEffect(() => {
  //   timer.addListener(updateRangeValue);
  //   return () => {
  //     timer.removeListener(updateRangeValue);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log(timeIndex);
  // }, [timeIndex]);
  return (
    <TableContainer border="1px solid black">
      <Table size="md" variant="simple">
        <Thead>
          <Tr>
            <Th width="10%" borderRight="1px solid black">
              Time
            </Th>
            <Th borderRight="1px solid black">歌詞</Th>
            <Th>ワード</Th>
          </Tr>
        </Thead>

        <Tbody>
          {mapData.map((line, index) => (
            <Tr
              key={index}
              className={`cursor-pointer ${
                selectedIndex === index
                  ? "bg-cyan-400 outline outline-2 outline-black"
                  : " hover:bg-cyan-400/35"
              } ${timeIndex === index ? " bg-teal-400/35" : ""}`}
              onClick={() => selectLine(line, index)}
            >
              <Td borderRight="1px solid black">{line.time}</Td>
              <Td borderRight="1px solid black">{line.lyrics}</Td>
              <Td>{line.word}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
