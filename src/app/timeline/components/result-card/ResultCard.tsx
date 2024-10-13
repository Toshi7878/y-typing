"use client";
import { Card, CardBody, CardFooter, CardHeader, Flex, Text, useTheme } from "@chakra-ui/react";
import { ResultCardInfo } from "../../ts/type";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { ThemeColors } from "@/types";
import MapLeftThumbnail from "./child/MapCardLeftThumbnail";
import MapInfo from "./child/MapInfo";
import MapResultBadges from "./child/MapResultBadges";
import UserRank from "./child/UserRank";
import UpdateAtText from "@/components/UpdateAtText";

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
      bg={theme.colors.card.bg}
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
    >
      <CardHeader bg={theme.colors.card.bg} borderRadius="md" mx={2} py={3}>
        <Text as="span">
          <Link
            href={`/user/${result.user.id}`}
            onClick={handleLinkClick}
            color={theme.colors.home.card.link}
            fontWeight="bold"
          >
            {result.user.name}
          </Link>{" "}
          - <UpdateAtText updatedAt={result.updatedAt} />
        </Text>
      </CardHeader>
      <CardBody
        color={"color"}
        bg={theme.colors.background}
        borderRadius="lg"
        className="flex items-start"
        style={{ padding: 0, border: "none" }}
        mx={6}
      >
        <Flex
          py={6}
          direction="row"
          gap={4}
          justifyContent="space-between"
          w="100%"
          alignItems="center"
        >
          <Flex direction="row" gap={4}>
            <UserRank userRank={result.rank} />
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
          <Flex justifyContent="flex-end">
            <MapResultBadges props={result} />
          </Flex>
        </Flex>
      </CardBody>
      <CardFooter bg={theme.colors.card.bg} borderRadius="md" pb={1}></CardFooter>
    </Card>
  );
}

export default ResultCard;
