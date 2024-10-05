"use client";
import { Box, Flex, useTheme } from "@chakra-ui/react";
import CustomToolTip from "@/components/CustomToolTip";
import { ResultCardInfo } from "@/app/timeline/ts/type";
import { ThemeColors } from "@/types";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";

interface MapCardProps {
  map: ResultCardInfo["map"];
}
function MapInfo({ map }: MapCardProps) {
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();

  return (
    <Flex direction="column" gap={1}>
      <CustomToolTip tooltipLabel={`${map.title} / ${map.artistName}`} placement="top">
        <Link
          href={`/type/${map.id}`}
          onClick={handleLinkClick}
          color={theme.colors.home.card.link}
        >
          <Box
            fontWeight="bold"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            fontSize="md"
          >
            {`${map.title} / ${map.artistName}`}
          </Box>
        </Link>
      </CustomToolTip>
    </Flex>
  );
}

export default MapInfo;
