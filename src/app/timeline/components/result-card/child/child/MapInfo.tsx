"use client";
import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import CustomToolTip from "@/components/CustomToolTip";
import { ResultCardInfo } from "@/app/timeline/ts/type";
import { ThemeColors } from "@/types";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import UpdateAtText from "@/components/UpdateAtText";

interface MapCardProps {
  map: ResultCardInfo["map"];
  isToggledInputMode: boolean;
}
function MapInfo({ map, isToggledInputMode }: MapCardProps) {
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();

  return (
    <Flex direction="column" gap={1} justifyContent="space-between">
      <CustomToolTip
        tooltipLabel={`${map.title} / ${map.artistName}${map.musicSouce ? `【${map.musicSouce}】` : ""}`}
        placement="top"
      >
        <Link
          href={`/type/${map.id}`}
          onClick={handleLinkClick}
          color={theme.colors.home.card.link}
          w={isToggledInputMode ? "16.5vw" : "20vw"}
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
      <Box fontSize="xs">
        <Text as="span">
          制作者:{" "}
          <Link
            href={`/user/${map.user.id}`}
            onClick={handleLinkClick}
            color={theme.colors.home.card.link}
          >
            {map.user.name}
          </Link>{" "}
          - <UpdateAtText updatedAt={map.updatedAt} />
        </Text>
      </Box>
    </Flex>
  );
}

export default MapInfo;
