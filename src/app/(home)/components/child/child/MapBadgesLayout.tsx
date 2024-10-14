import { MapCardInfo } from "@/app/(home)/ts/type";
import CustomToolTip from "@/components/CustomToolTip";
import { Box, HStack, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import MapBadge from "./MapBadge";

interface MapBadgesProps {
  map: MapCardInfo;
}

const MapBadges = (props: MapBadgesProps) => {
  const { map } = props;
  const showBadges = useBreakpointValue({ base: false, sm: true });

  return (
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
  );
};

export default MapBadges;
