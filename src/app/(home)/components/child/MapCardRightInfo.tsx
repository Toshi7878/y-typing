"use client";
import { Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { MapCardInfo } from "../../ts/type";
import MapInfo from "./child/MapInfo";
import MapCreateUser from "./child/MapCreateUser";
import MapBadges from "./child/MapBadgesLayout";

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
      _hover={{ textDecoration: "none" }}
    >
      <MapInfo map={map} />
      <Stack
        justifyContent="space-between"
        flexDirection={{ base: "row", md: "column" }} // 変更点: レスポンシブなflexDirectionを追加
        mt={2}
      >
        <MapCreateUser map={map} />
        <MapBadges map={map} />
      </Stack>
    </Link>
  );
}

export default MapCardRightInfo;
