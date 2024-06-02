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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePlayer } from "../(youtube-content)/playerContext";

export default function TableContent() {
  const { playerRef } = usePlayer();
  const playing: boolean = useSelector(
    (state: { playing: { value: boolean } }) => state.playing.value
  );
  const [mapData, setMapData] = useState([
    { time: 0, lyrics: "lyrics", word: "word" },
  ]);

  useEffect(() => {
    if (playing && mapData.length == 1) {
      const duration = Number(playerRef.current?.getDuration());
      setMapData([...mapData, { time: duration, lyrics: "end", word: "" }]);
    }
  }, [playerRef, playing, mapData]);

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
            <Tr key={index}>
              <Td borderRight="1px solid black">{line.time.toFixed(3)}</Td>
              <Td borderRight="1px solid black">{line.lyrics}</Td>
              <Td>{line.word}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
