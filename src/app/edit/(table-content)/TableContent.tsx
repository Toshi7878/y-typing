/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";

import "../(style)/table.scss";
import LineRow from "./(components)/LineRow";
import { useEffect, useRef } from "react";
import { useRefs } from "../(contexts)/refsProvider";

export default function TableContent() {
  const tbodyRef = useRef(null);

  const { setRef } = useRefs();

  useEffect(() => {
    setRef("tbody", tbodyRef.current);
  }, []);

  return (
    <TableContainer
      className="border border-black sm:max-h-[calc(100vh-100px)] md:max-h-[500px] 2xl:max-h-[calc(100vh-400px)]"
      overflowY="auto"
    >
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th width="5%" borderRight="1px solid black">
              Time
            </Th>
            <Th borderRight="1px solid black">歌詞</Th>
            <Th borderRight="1px solid black">ワード</Th>
            <Th width="3%" textAlign="center">
              オプション
            </Th>
          </Tr>
        </Thead>
        <Tbody ref={tbodyRef}>
          <LineRow />
        </Tbody>
      </Table>
    </TableContainer>
  );
}
