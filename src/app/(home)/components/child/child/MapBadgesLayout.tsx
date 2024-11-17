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
                ? theme.colors.home.card.link
                : `${theme.colors.color}99`
          }
          mr={2}
        >
          <Box mr={1} position="relative" top="3px">
            {map.myRank === 1 ? (
              <PiRankingFill size={20} />
            ) : map.myRank ? (
              <PiRankingDuotone size={20} />
            ) : (
              <PiRankingLight size={20} />
            )}
          </Box>
          <Box fontSize="lg">{map.rankingCount}</Box>
        </Flex>
        <Flex alignItems="baseline" color={map.hasLike ? "#f472b6" : `${theme.colors.color}99`}>
          <Box mr={1} position="relative" top="2.5px">
            {map.hasLike ? <FaHeart size={16} /> : <FiHeart size={18} />}
          </Box>
          <Box fontSize="lg">{map.likeCount}</Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MapBadges;
