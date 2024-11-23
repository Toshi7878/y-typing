import { Card, CardBody, Box, useTheme } from "@chakra-ui/react"; // Boxコンポーネントを追加

import RankingList from "./child/RankingList";
import { ThemeColors } from "@/types";

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
      <CardBody fontSize="3xl" fontWeight="bold" width="full" pt={1} pb={2}>
        <Box
          overflowY="scroll"
          minH={props.height}
          maxH={props.height}
          sx={{
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.colors.text.header.normal,
              borderRadius: "10px",
              border: "2px solid transparent",
              backgroundClip: "content-box",
            },
          }}
        >
          <RankingList />
        </Box>
      </CardBody>
    </Card>
  );
};

export default TabRanking;
