import { Card, CardBody, Table, Thead, Tbody, Tr, Th, Box } from "@chakra-ui/react"; // Boxコンポーネントを追加

import RankingList from "./child/RankingList";

interface TabRankingProps {
  height: string;
}

const TabRanking = (props: TabRankingProps) => {
  return (
    <Card
      className="tab-card"
      variant={"filled"}
      bg="type.card.bg"
      boxShadow="lg"
      color={"type.card.color"}
    >
      <CardBody className="text-3xl font-bold w-full" pt={2}>
        <Box overflowY="auto" minH={props.height}>
          <Table variant="simple" className="ranking-table" size="sm">
            <Thead>
              <Tr>
                <Th width="5%" color="type.card.color">
                  順位
                </Th>
                <Th width="15%" color="type.card.color">
                  名前
                </Th>
                <Th width="10%" color="type.card.color">
                  Score
                </Th>
                <Th width="5%" color="type.card.color">
                  正確率
                </Th>
                <Th width="5%" color="type.card.color">
                  kpm
                </Th>
                <Th width="10%" color="type.card.color">
                  モード
                </Th>
                <Th width="10%" color="type.card.color">
                  時間
                </Th>
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
