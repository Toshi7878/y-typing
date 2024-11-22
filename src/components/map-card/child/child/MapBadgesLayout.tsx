import { MapCardInfo } from "@/app/(home)/ts/type";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { Box, Flex, HStack, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import MapBadge from "./MapBadge";
import LikeCount from "./child/LikeCount";
import RankingCount from "./child/RankingCount";

interface MapBadgesProps {
  map: MapCardInfo;
  isCardHover: boolean;
}

const MapBadges = (props: MapBadgesProps) => {
  const { map } = props;
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
        <RankingCount map={map} />
        <LikeCount map={map} />
      </Flex>
    </Flex>
  );
};

export default MapBadges;
