import { Card, CardBody, Table, Thead, Tbody, Tr, Th, Box, useTheme } from "@chakra-ui/react"; // Boxコンポーネントを追加

import RankingList from "./child/RankingList";

interface TabRankingProps {
  height: string;
}

const TabRanking = (props: TabRankingProps) => {
  const theme = useTheme();

  return (
    <Card
      className="tab-card"
      variant="filled"
      bg={theme.colors.type.card.bg}
      boxShadow="lg"
      color={theme.colors.type.card.color}
    >
      <CardBody className="text-3xl font-bold w-full" pt={2}>
        <Box
          overflowY="scroll"
          minH={props.height}
          maxH={props.height}
          sx={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.colors.type.card.borderColor,
              borderRadius: "10px", // スクロールバーの角を丸くする
              border: "2px solid transparent", // スクロールバーの内側にスペースを作る
              backgroundClip: "content-box", // 背景をクリップ
            },
            // "&::-webkit-scrollbar-track": {
            //   background: theme.colors.background, // スクロールバーのトラックの色を設定
            // },
            "&::-webkit-scrollbar-corner": {
              background: "pink", // スクロールバーのコーナーの色を設定
            },
          }}
        >
          <Table
            variant="simple"
            className="ranking-table"
            size="sm"
            sx={{
              "th, td": {
                borderColor: theme.colors.type.card.color,
              },
              "tr, td": {
                paddingY: "0.5rem", // smとmdの間のサイズに調整
                fontSize: "1rem", // smとmdの間のフォントサイズに調整
              },
            }}
          >
            <Thead position="sticky" top={0} pt={2} zIndex={1} bg={theme.colors.type.card.bg}>
              <Tr>
                <Th width="5%" color={theme.colors.type.card.color}>
                  順位
                </Th>
                <Th width="15%" color={theme.colors.type.card.color}>
                  名前
                </Th>
                <Th width="10%" color={theme.colors.type.card.color}>
                  Score
                </Th>
                <Th width="5%" color={theme.colors.type.card.color}>
                  正確率
                </Th>
                <Th width="5%" color={theme.colors.type.card.color}>
                  kpm
                </Th>
                <Th width="10%" color={theme.colors.type.card.color}>
                  モード
                </Th>
                <Th width="10%" color={theme.colors.type.card.color}>
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
