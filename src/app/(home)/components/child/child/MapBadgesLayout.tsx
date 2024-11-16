import { MapCardInfo } from "@/app/(home)/ts/type";
import CustomToolTip from "@/components/CustomToolTip";
import { Box, Flex, HStack, useBreakpointValue, useTheme } from "@chakra-ui/react";
import React from "react";
import MapBadge from "./MapBadge";
import { FiHeart } from "react-icons/fi";
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
      {/* {props.isCardHover ? ( */}
      <Flex alignItems="baseline" color={`${theme.colors.color}99`}>
        <Box mr={0.5}>
          <FiHeart size={10} />
        </Box>
        <Box fontSize="sm">{map.likeCount}</Box>
      </Flex>
      {/* ) : null} */}
    </Flex>
  );
};

export default MapBadges;
