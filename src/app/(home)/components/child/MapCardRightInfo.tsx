"use client";
import { Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { MapCardInfo } from "../../ts/type";
import MapInfo from "./child/MapInfo";
import UpdateAtText from "@/components/UpdateAtText";

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
      <Text as="small" mt={4}>
        <Link href={`/user/${map.user.id}`} onClick={handleLinkClick} color={"home.card.link"}>
          {map.user.name}
        </Link>

        <Text as="span" fontSize="xs">
          {" "}
          - <UpdateAtText updatedAt={map.updatedAt} />
        </Text>
      </Text>
    </Link>
  );
}

export default MapCardRightInfo;
