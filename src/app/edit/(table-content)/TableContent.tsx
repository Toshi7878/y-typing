/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";

import "../(style)/table.scss";
import LineRow from "./(components)/LineRow";
import { useEffect, useRef } from "react";
import { useRefs } from "../(contexts)/refsProvider";
export default function TableContent() {
  console.log("Table");
  const lineRowRef = useRef(null);

  const { setRef } = useRefs();

  useEffect(() => {
    setRef("lineRow", lineRowRef.current);
  }, [lineRowRef]);

  return (
    <TableContainer border="1px solid black" maxHeight="calc(100vh - 400px)" overflowY="auto">
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
        <Tbody>
          <LineRow ref={lineRowRef} />
        </Tbody>
      </Table>
    </TableContainer>
  );
}
