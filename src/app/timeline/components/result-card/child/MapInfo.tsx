"use client";
import { Box, Flex, useTheme } from "@chakra-ui/react";
import CustomToolTip from "@/components/CustomToolTip";
import { MapCardInfo } from "@/app/(home)/ts/type";
import { ResultCardInfo } from "@/app/timeline/ts/type";
import { ThemeColors } from "@/types";

interface MapCardProps {
  map: ResultCardInfo["map"];
}
function MapInfo({ map }: MapCardProps) {
  const theme: ThemeColors = useTheme();
  return (
    <Flex direction="column" gap={1}>
      <CustomToolTip tooltipLabel={`${map.title} / ${map.artistName}`} placement="top">
        <Box
          color={theme.colors.home.card.link}
          fontWeight="bold"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="md"
        >
          {`${map.title} / ${map.artistName}`}
        </Box>
      </CustomToolTip>
    </Flex>
  );
}

export default MapInfo;
