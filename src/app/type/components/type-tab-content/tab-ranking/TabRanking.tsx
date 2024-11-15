import { Card, CardBody, Table, Thead, Tbody, Tr, Th, Box, useTheme } from "@chakra-ui/react"; // Boxコンポーネントを追加

import RankingList from "./child/RankingList";
import { FaHandsClapping } from "react-icons/fa6";

interface TabRankingProps {
  height: string;
}

const TabRanking = (props: TabRankingProps) => {
  const theme = useTheme();

  return (
    <Card
      className="tab-card"
      variant="filled"
      bg={theme.colors.card.bg}
      boxShadow="lg"
      color={theme.colors.card.color}
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
              background: theme.colors.card.borderColor,
              borderRadius: "10px", // スクロールバーの角を丸くする
              border: "2px solid transparent", // スクロールバーの内側にスペースを作る
              backgroundClip: "content-box", // 背景をクリップ
            },
          }}
        >
          <Table
            variant="simple"
            className="ranking-table"
            size="sm"
            sx={{
              "th, td": {
                borderColor: theme.colors.card.color,
              },
              "tr, td": {
                paddingY: "0.5rem", // smとmdの間のサイズに調整
                fontSize: "1rem", // smとmdの間のフォントサイズに調整
              },
            }}
          >
            <Thead
              position="sticky"
              top={0}
              pt={2}
              zIndex={1}
              className="ranking-thead"
              style={{ userSelect: "none" }}
            >
              <Tr>
                <Th width="5%" color={theme.colors.card.color}>
                  順位
                </Th>
                <Th width="15%" color={theme.colors.card.color}>
                  名前
                </Th>
                <Th width="10%" color={theme.colors.card.color}>
                  Score
                </Th>
                <Th width="7%" color={theme.colors.card.color}>
                  クリア率
                </Th>
                <Th width="5%" color={theme.colors.card.color}>
                  kpm
                </Th>
                <Th width="10%" color={theme.colors.card.color}>
                  モード
                </Th>
                <Th width="10%" color={theme.colors.card.color}>
                  時間
                </Th>
                <Th
                  width="1%"
                  position="relative"
                  right={1}
                  top={-0.5}
                  color={theme.colors.card.color}
                >
                  <FaHandsClapping size={"1rem"} />
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
