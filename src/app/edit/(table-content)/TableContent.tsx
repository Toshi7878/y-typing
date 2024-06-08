"use client";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from "@chakra-ui/react";
import { useMemo, SetStateAction, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "../(youtube-content)/playerProvider";
import { RootState } from "../(redux)/store";
import { addLine } from "../(redux)/mapDataSlice";
import { setSelectedIndex, setTimeIndex } from "../(redux)/lineIndexSlice";
import { InputFormSchema } from "../(contexts)/Schema";
import { timer } from "../(youtube-content)/timer";

export default function TableContent() {
  console.log("Table");
  const { playerRef } = usePlayer();
  const dispatch = useDispatch();
  const playing = useSelector((state: RootState) => state.playing.value);
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const timeIndex = useSelector((state: RootState) => state.lineIndex.timeIndex);
  const mapData = useSelector((state: RootState) => state.mapData.value);

  useEffect(() => {
    if (playing && mapData.length === 1) {
      const duration = playerRef.current?.getDuration();
      dispatch(addLine({ time: duration.toFixed(3), lyrics: "end", word: "" }));
    }
  }, [playerRef, playing, mapData, dispatch]);

  const selectLine = (line: InputFormSchema["EditorTab"], index: SetStateAction<number | null>) => {
    // setValue("EditorTab.time", line.time);
    // setValue("EditorTab.lyrics", line.lyrics);
    // setValue("EditorTab.word", line.word);
    // setValue("EditorTab.lineNumber", index);
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

  return (
    <TableContainer border="1px solid black" maxHeight="calc(100vh - 400px)" overflowY="auto">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th width="10%" borderRight="1px solid black">
              Time
            </Th>
            <Th borderRight="1px solid black">歌詞</Th>
            <Th borderRight="1px solid black">ワード</Th>
            <Th width="3%" textAlign="center">
              オプション
            </Th>
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
        </Tbody>
      </Table>
    </TableContainer>
  );
}
