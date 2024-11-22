import { Card, CardBody, Table, Thead, Tbody, Tr, Th, Box, useTheme } from "@chakra-ui/react"; // Boxコンポーネントを追加

import RankingList from "./child/RankingList";
import { FaHandsClapping } from "react-icons/fa6";
import { ThemeColors } from "@/types";
import { RANKING_COLUMN_WIDTH } from "@/app/type/ts/const/consts";

interface TabRankingProps {
  height: string;
}

const TabRanking = (props: TabRankingProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Card
      className="tab-card"
      variant="filled"
      bg={theme.colors.background.card}
      boxShadow="lg"
      color={theme.colors.text.body}
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
              background: theme.colors.border.card,
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
                borderColor: theme.colors.border.card,
              },
              "tr, td": {
                paddingY: "0.6rem", // smとmdの間のサイズに調整
                fontSize: "1.13rem", // smとmdの間のフォントサイズに調整
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
                <Th width={RANKING_COLUMN_WIDTH.rank} color={theme.colors.text.body}>
                  順位
                </Th>
                <Th width={RANKING_COLUMN_WIDTH.score} color={theme.colors.text.body}>
                  Score
                </Th>
                <Th width={RANKING_COLUMN_WIDTH.clearRate} color={theme.colors.text.body}>
                  クリア率
                </Th>
                <Th width={RANKING_COLUMN_WIDTH.userName} color={theme.colors.text.body}>
                  名前
                </Th>

                <Th width={RANKING_COLUMN_WIDTH.kpm} color={theme.colors.text.body}>
                  kpm
                </Th>
                <Th width={RANKING_COLUMN_WIDTH.inputMode} color={theme.colors.text.body}>
                  モード
                </Th>
                <Th width={RANKING_COLUMN_WIDTH.updatedAt} color={theme.colors.text.body}>
                  時間
                </Th>
                <Th
                  width={RANKING_COLUMN_WIDTH.clapCount}
                  position="relative"
                  right={1}
                  top={-0.5}
                  color={theme.colors.text.body}
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
