"use client";
import { Text } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { ResultCardInfo } from "../../ts/type";
import MapInfo from "./child/MapInfo";

interface MapCardProps {
  result: ResultCardInfo;
}
function MapCardRightInfo({ result }: MapCardProps) {
  const handleLinkClick = useLinkClick();

  return (
    <Link
      href={`/type/${result.map.id}`}
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
      <MapInfo map={result.map} />
      <Text as="small" mt={4}>
        <Text as="span" fontSize="xs">
          {" "}
          -{" "}
          {formatDistanceToNowStrict(new Date(result.map.updatedAt), {
            addSuffix: true,
            locale: ja,
          })}
        </Text>
      </Text>
    </Link>
  );
}

export default MapCardRightInfo;
