"use client";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "../(youtube-content)/playerProvider";
import { RootState } from "../(redux)/store";
import { addLine } from "../(redux)/mapDataSlice";
import { useFormContext } from "react-hook-form";
import { DefaultValues } from "../(tab-content)/TabFormProvider";

export default function TableContent() {
  const { setValue } = useFormContext();
  const { playerRef } = usePlayer();
  const dispatch = useDispatch();
  const playing: boolean = useSelector(
    (state: RootState) => state.playing.value
  );
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (playing && mapData.length === 1) {
      const duration = Number(playerRef.current?.getDuration());
      dispatch(addLine({ time: duration, lyrics: "end", word: "" }));
    }
  }, [playerRef, playing, mapData, dispatch]);

  const selectLine = (
    line: DefaultValues["EditorTab"],
    index: SetStateAction<number | null>
  ) => {
    setValue("lineEditor.time", line.time);
    setValue("lineEditor.lyrics", line.lyrics);
    setValue("lineEditor.word", line.word);
    setValue("lineEditor.lineNumber", index);
    setSelectedIndex(index);
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
              className={`cursor-pointer ${
                selectedIndex === index
                  ? "bg-cyan-400 outline outline-2 outline-black"
                  : " hover:bg-cyan-400/35"
              }`}
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
