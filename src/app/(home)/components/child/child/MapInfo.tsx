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
        tooltipLabel={`${map.title} / ${map.artistName}${map.musicSource ? `【${map.musicSource}】` : ""}`}
        placement="top"
      >
        <Box
          className="text-xs sm:text-md"
          color={"home.card.link"}
          fontWeight="bold"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {map.title}
        </Box>
      </CustomToolTip>

      <Box
        className="text-xs sm:text-sm"
        color={"home.card.link"}
        fontWeight="bold"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {map.artistName || "\u00A0"}
        {map.musicSource ? `【${map.musicSource}】` : "\u00A0"}
      </Box>
    </Flex>
  );
}

export default MapInfo;
