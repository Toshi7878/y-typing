"use client";
import { Box, Flex } from "@chakra-ui/react";
import CustomToolTip from "@/components/CustomToolTip";
import { MapCardInfo } from "@/app/(home)/ts/type";

interface MapCardProps {
  map: MapCardInfo;
}
function MapInfo({ map }: MapCardProps) {
  return (
    <Flex direction="column" gap={1}>
      <CustomToolTip
        tooltipLabel={`${map.title} / ${map.artistName}${map.musicSouce ? `【${map.musicSouce}】` : ""}`}
        placement="top"
      >
        <Box
          color={"home.card.link"}
          fontWeight="bold"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="md"
        >
          {map.title}
        </Box>
      </CustomToolTip>

      <Box
        color={"home.card.link"}
        fontWeight="bold"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        fontSize="sm"
      >
        {map.artistName || "\u00A0"}
      </Box>
      <Box
        color={"home.card.link"}
        fontWeight="bold"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        fontSize="xs"
      >
        {map.musicSouce || "\u00A0"}
      </Box>
    </Flex>
  );
}

export default MapInfo;
