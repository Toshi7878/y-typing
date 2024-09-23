"use client";
import { Box, Text } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/app/nprogress";
import CustomToolTip from "@/components/CustomToolTip";
import { MapCardInfo } from "../../ts/type";

interface MapCardProps {
  map: MapCardInfo;
}
function MapCardRightInfo({ map }: MapCardProps) {
  const handleLinkClick = useLinkClick();

  return (
    <Link
      href={`/type/${map.id}`}
      onClick={handleLinkClick}
      display="flex"
      flexDirection="column"
      justifyContent="start"
      h="full"
      w="65%"
      pl={3}
      pt={2}
      fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
      _hover={{ textDecoration: "none" }} // 追加: ホバー時の下線を無効化する
    >
      <CustomToolTip tooltipLabel={`${map.title} / ${map.artistName}`} placement="top">
        <Box
          color={"home.card.link"}
          fontWeight="bold"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="lg"
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
        mt={1}
      >
        {map.musicSouce || "\u00A0"}
      </Box>
      <Text as="small" mt={2}>
        <Link href={`/user/${map.user.id}`} onClick={handleLinkClick} color={"home.card.link"}>
          {map.user.name}
        </Link>

        <Text as="span" fontSize="xs">
          {" "}
          -{" "}
          {formatDistanceToNowStrict(new Date(map.updatedAt), {
            addSuffix: true,
            locale: ja,
          })}
        </Text>
      </Text>
    </Link>
  );
}

export default MapCardRightInfo;
