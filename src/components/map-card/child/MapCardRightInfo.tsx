"use client";
import { Flex, Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { MapCardInfo } from "../../../app/(home)/ts/type";
import MapInfo from "./child/MapInfo";
import MapCreateUser from "./child/MapCreateUser";
import MapBadges from "./child/MapBadgesLayout";

interface MapCardProps {
  map: MapCardInfo;
  isCardHover: boolean;
}
function MapCardRightInfo({ map, isCardHover }: MapCardProps) {
  const handleLinkClick = useLinkClick();

  return (
    <Link
      href={`/type/${map.id}`}
      onClick={handleLinkClick}
      as={Flex}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      h="full"
      width={{ base: "100%", lg: "55%", "2xl": "65%" }} // 2xlを追加
      pl={3}
      pt={2}
      fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
      _hover={{ textDecoration: "none" }}
    >
      <MapInfo map={map} />
      <Stack justifyContent="space-between" flexDirection={{ base: "row", md: "column" }} my={1}>
        <MapCreateUser map={map} />
        <MapBadges map={map} isCardHover={isCardHover} />
      </Stack>
    </Link>
  );
}

export default MapCardRightInfo;
