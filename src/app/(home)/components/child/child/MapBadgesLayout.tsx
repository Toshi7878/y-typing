import { MapCardInfo } from "@/app/(home)/ts/type";
import CustomToolTip from "@/components/CustomToolTip";
import { Box, Flex, HStack, useBreakpointValue, useTheme } from "@chakra-ui/react";
import React from "react";
import MapBadge from "./MapBadge";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { PiRankingLight } from "react-icons/pi";
import { PiRankingFill } from "react-icons/pi";
import { PiRankingDuotone } from "react-icons/pi";

import { ThemeColors } from "@/types";

interface MapBadgesProps {
  map: MapCardInfo;
  isCardHover: boolean;
}

const MapBadges = (props: MapBadgesProps) => {
  const { map } = props;
  const theme: ThemeColors = useTheme();
  const showBadges = useBreakpointValue({ base: false, sm: true });

  return (
    <Flex justifyContent="space-between" mr={3}>
      <HStack mr={2}>
        <CustomToolTip
          tooltipLabel={
            <Box>
              <Box>最高速度:{map.romaKpmMax}kpm</Box>
            </Box>
          }
          placement="top"
        >
          <MapBadge>★{(map.romaKpmMedian / 100).toFixed(1)}</MapBadge>
        </CustomToolTip>
        {showBadges && (
          <MapBadge>{new Date(map.totalTime * 1000).toISOString().slice(14, 19)}</MapBadge>
        )}
      </HStack>
      <Flex>
        <Flex
          alignItems="baseline"
          color={
            map.myRank === 1
              ? theme.colors.type.tab.ranking.perfect.color
              : map.myRank
                ? theme.colors.color
                : `${theme.colors.color}99`
          }
          mr={2}
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }} // ぼかしを強調
        >
          <Box mr={0.5} position="relative" top="2px">
            {map.myRank === 1 ? (
              <PiRankingFill size={14} />
            ) : map.myRank ? (
              <PiRankingDuotone size={14} />
            ) : (
              <PiRankingLight size={14} />
            )}
          </Box>
          <Box fontSize="sm">{map.rankingCount}</Box>
        </Flex>
        <Flex alignItems="baseline" color={map.hasLike ? "#f472b6" : `${theme.colors.color}99`}>
          <Box mr={0.5}>{map.hasLike ? <FaHeart size={10} /> : <FiHeart size={10} />}</Box>
          <Box fontSize="sm">{map.likeCount}</Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MapBadges;
