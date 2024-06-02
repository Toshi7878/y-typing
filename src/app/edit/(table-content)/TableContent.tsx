"use client";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "../(youtube-content)/playerContext";
import { RootState } from "../(redux)/store";
import { addLine } from "../(redux)/mapDataSlice";
import {
  setLineNumber,
  setLyrics,
  setTime,
  setWord,
} from "../(redux)/selectLineSlice";

export default function TableContent() {
  const { playerRef } = usePlayer();
  const dispatch = useDispatch();
  const playing: boolean = useSelector(
    (state: RootState) => state.playing.value
  );
  const mapData = useSelector((state: RootState) => state.mapData.value);

  useEffect(() => {
    if (playing && mapData.length === 1) {
      const duration = Number(playerRef.current?.getDuration());
      dispatch(addLine({ time: duration, lyrics: "end", word: "" }));
    }
  }, [playerRef, playing, mapData, dispatch]);

  const selectLine = (line, index) => {
    dispatch(setTime(line.time));
    dispatch(setLyrics(line.lyrics));
    dispatch(setWord(line.word));
    dispatch(setLineNumber(index));
  };

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
              className="cursor-pointer hover:bg-slate-400"
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
