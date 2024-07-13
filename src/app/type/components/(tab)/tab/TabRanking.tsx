import React, { forwardRef } from "react";

import { Card, CardBody, Table, Thead, Tbody, Tr, Th, Box } from "@chakra-ui/react"; // Boxコンポーネントを追加

import "../../../style/statusTable.scss";
import RankingList from "./child/RankingList";

const TabRanking = forwardRef((props, ref) => {
  return (
    <Card variant={"filled"} bg="blue.100" boxShadow="lg">
      <CardBody className="text-3xl font-bold w-full">
        <Box maxH="244px" minH="244px" overflowY="auto">
          {" "}
          {/* max heightとスクロールを追加 */}
          <Table variant="simple" className="ranking-table" size="sm">
            <Thead>
              <Tr>
                <Th>順位</Th>
                <Th>名前</Th>
                <Th>Score</Th>
                <Th>正確率</Th>
                <Th>kpm</Th>
              </Tr>
            </Thead>
            <Tbody>
              <RankingList />
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
});

TabRanking.displayName = "TabRanking";

export default TabRanking;
