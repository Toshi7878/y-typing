"use client";
import { Box, useTheme, Text, Tooltip } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import { ja } from "date-fns/locale";
import { Link } from "@chakra-ui/next-js";
import { handleLinkClick } from "@/app/nprogress";
import { MapCardInfo } from "../MapList";

interface MapCardProps {
  map: MapCardInfo;
}
function MapCardRightInfo({ map }: MapCardProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Link
      href={`/type/${map.id}`}
      onClick={handleLinkClick(`/type/${map.id}`, router)}
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
      <Tooltip
        label={map.title}
        placement="top"
        whiteSpace="normal"
        hasArrow
        bg={theme.colors.popup.bg}
        color={theme.colors.popup.color}
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.colors.card.borderColor}
        css={{
          "--popper-arrow-bg": theme.colors.popup.bg,
          "--popper-arrow-shadow-color": theme.colors.card.borderColor,
        }}
      >
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
      </Tooltip>

      <Text as="small">
        <Link
          href={`/user/${map.user.id}`}
          onClick={handleLinkClick(`/user/${map.user.id}`, router)}
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
