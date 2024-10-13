"use client";
import { Badge, Box, HStack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { MapCardInfo } from "../../ts/type";
import MapInfo from "./child/MapInfo";
import MapCreateUser from "./child/MapCreateUser";
import CustomToolTip from "@/components/CustomToolTip";

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
      <MapCreateUser map={map} />
      <CustomToolTip
        tooltipLabel={
          <Box>
            <Box>最高速度:{map.romaKpmMax}kpm</Box>
          </Box>
        }
        placement="top"
      >
        <HStack mt={2}>
          <Badge fontSize="sm" borderRadius="full" px={2}>
            ★{(map.romaKpmMedian / 100).toFixed(1)}
          </Badge>
          <Badge fontSize="sm" borderRadius="full" px={2}>
            {new Date(map.totalTime * 1000).toISOString().slice(14, 19)}
          </Badge>
        </HStack>
      </CustomToolTip>
    </Link>
  );
}

export default MapCardRightInfo;
