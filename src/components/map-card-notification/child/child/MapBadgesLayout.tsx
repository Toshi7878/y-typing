import { MapCardInfo } from "@/app/(home)/ts/type";
import CustomToolTip from "@/components/custom-ui/CustomToolTip";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";
import MapBadge from "./MapBadge";
import LikeCount from "./child/LikeCount";
import RankingCount from "./child/RankingCount";

interface MapBadgesProps {
  map: MapCardInfo;
}

const MapBadges = (props: MapBadgesProps) => {
  const { map } = props;

  return (
    <Flex justifyContent="space-between" width="98%" mr={3}>
      <HStack mr={2}>
        <CustomToolTip
          tooltipLabel={
            <Box>
              <Box>最高速度:{map.romaKpmMax}kpm</Box>
            </Box>
          }
          placement="top"
        >
          <MapBadge>
            <Text as="span" fontSize="xs" display={{ base: "none", sm: "inline-block" }}>
              ★
            </Text>
            {(map.romaKpmMedian / 100).toFixed(1)}
          </MapBadge>
        </CustomToolTip>
      </HStack>
      <Flex>
        <RankingCount map={map} />
        <LikeCount map={map} />
      </Flex>
    </Flex>
  );
};

export default MapBadges;
