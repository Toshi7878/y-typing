"use client";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { ResultCardInfo } from "../../ts/type";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { ThemeColors } from "@/types";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import MapLeftThumbnail from "./MapCardLeftThumbnail";
import MapInfo from "./child/MapInfo";

interface ResultCardProps {
  result: ResultCardInfo;
}

function ResultCard({ result }: ResultCardProps) {
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();

  const src =
    result.map.thumbnailQuality === "maxresdefault"
      ? `https://i.ytimg.com/vi_webp/${result.map.videoId}/maxresdefault.webp`
      : `https://i.ytimg.com/vi/${result.map.videoId}/mqdefault.jpg`;

  return (
    <Card
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
    >
      <CardHeader bg={theme.colors.card.bg} borderRadius="md">
        <Link
          href={`/user/${result.user.id}`}
          onClick={handleLinkClick}
          color={theme.colors.home.card.link}
          fontWeight="bold"
        >
          {result.user.name}
        </Link>
        <Text as="span">
          {" "}
          -{" "}
          {formatDistanceToNowStrict(new Date(result.updatedAt), {
            addSuffix: true,
            locale: ja,
          })}
        </Text>
      </CardHeader>
      <CardBody
        color={"color"}
        bg={theme.colors.background}
        borderRadius="lg"
        className="flex items-start"
        style={{ padding: 0, border: "none" }}
      >
        {result.id}
        <Flex py={6} ml={10} direction="row" gap={4}>
          <MapLeftThumbnail
            alt={result.map.title}
            src={src}
            fallbackSrc={`https://i.ytimg.com/vi/${result.map.videoId}/mqdefault.jpg`}
            mapVideoId={result.map.videoId}
            mapPreviewTime={result.map.previewTime}
            thumbnailQuality={result.map.thumbnailQuality}
          />
          <MapInfo map={result.map} />
        </Flex>
      </CardBody>
      <CardFooter bg={theme.colors.card.bg} borderRadius="md"></CardFooter>
    </Card>
  );
}

export default ResultCard;
