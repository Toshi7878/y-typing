import { MapCardInfo } from "@/app/(home)/ts/type";
import { ThemeColors } from "@/types";
import { Box, Flex, useTheme } from "@chakra-ui/react";
import React from "react";
import { FaRankingStar } from "react-icons/fa6";

interface RankingCountProps {
  map: MapCardInfo;
}

const RankingCount = (props: RankingCountProps) => {
  const theme: ThemeColors = useTheme();
  const { map } = props;
  return (
    <Flex
      alignItems="baseline"
      color={
        map.myRank === 1
          ? theme.colors.semantic.perfect
          : map.myRank
            ? theme.colors.secondary.main
            : `${"text.body"}99`
      }
      mr={1}
    >
      <Box mr={1} position="relative" top="3px">
        <FaRankingStar size={20} />
      </Box>
      <Box fontSize="lg" fontFamily="monospace">
        {map.rankingCount}
      </Box>
    </Flex>
  );
};

export default RankingCount;
