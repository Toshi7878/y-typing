"use client";
import { Box, useTheme, Text, Tooltip } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import { ja } from "date-fns/locale";
import { Link } from "@chakra-ui/next-js";
import { handleLinkClick, useLinkClick } from "@/app/nprogress";
import { MapCardInfo } from "../MapList";
import CustomToolTip from "@/components/CustomToolTip";

interface MapCardProps {
  map: MapCardInfo;
}
function MapCardRightInfo({ map }: MapCardProps) {
  const theme = useTheme();
  const handleLinkClick = useLinkClick();

  return (
    <Link
      href={`/type/${map.id}`}
      onClick={(event) => handleLinkClick(event, `/type/${map.id}`)}
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
      <CustomToolTip tooltipLabel={map.title} placement="top">
        <Box
          color={"home.card.link"}
          fontWeight="bold"
          className="hover:underline"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {map.title}
        </Box>
      </CustomToolTip>

      <Text as="small">
        <Link
          href={`/user/${map.user.id}`}
          onClick={(event) => handleLinkClick(event, `/type/${map.id}`)}
          color={"home.card.link"}
        >
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
