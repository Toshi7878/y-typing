"use client";
import { Box, Flex, useTheme } from "@chakra-ui/react";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { MapCardInfo } from "@/app/(home)/ts/type";
import { ThemeColors } from "@/types";

interface MapCardProps {
  map: MapCardInfo;
}
function MapInfo({ map }: MapCardProps) {
  const theme: ThemeColors = useTheme();

  return (
    <Flex direction="column" gap={1}>
      <CustomToolTip
        tooltipLabel={`${map.title} / ${map.artistName}${map.musicSource ? `【${map.musicSource}】` : ""}`}
        placement="top"
      >
        <Box
          color={theme.colors.secondary.main}
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
        className="text-xs sm:text-sm"
        color={theme.colors.secondary.main}
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
