import { Card, CardBody, Table, Thead, Tbody, Tr, Th, Box } from "@chakra-ui/react"; // Boxコンポーネントを追加

import RankingList from "./child/RankingList";

interface TabRankingProps {
  height: string;
}

const TabRanking = (props: TabRankingProps) => {
  return (
    <Card className="tab-card" variant={"filled"} bg="blue.100" boxShadow="lg">
      <CardBody className="text-3xl font-bold w-full">
        <Box overflowY="auto" minH={props.height}>
          <Table variant="simple" className="ranking-table" size="sm">
            <Thead>
              <Tr>
                <Th width="5%">順位</Th>
                <Th width="15%">名前</Th>
                <Th width="10%">Score</Th>
                <Th width="5%">正確率</Th>
                <Th width="5%">kpm</Th>
                <Th width="10%">モード</Th>
                <Th width="10%">時間</Th>
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
};

TabRanking.displayName = "TabRanking";

export default TabRanking;
