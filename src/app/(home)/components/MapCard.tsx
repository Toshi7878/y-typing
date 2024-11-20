"use client";
import { Card, CardBody, useTheme } from "@chakra-ui/react";

import MapLeftThumbnail from "./child/MapCardLeftThumbnail";
import MapCardRightInfo from "./child/MapCardRightInfo";
import { MapCardInfo } from "../ts/type";
import { useState } from "react";
import { ThemeColors } from "@/types";

interface MapCardProps {
  map: MapCardInfo;
  maxW: string;
}
function MapCard({ map, maxW }: MapCardProps) {
  const theme: ThemeColors = useTheme();

  const [isCardHover, setIsCardHover] = useState<boolean>(false);
  const src =
    map.thumbnailQuality === "maxresdefault"
      ? `https://i.ytimg.com/vi_webp/${map.videoId}/maxresdefault.webp`
      : `https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`;

  return (
    <Card
      key={map.id}
      borderRadius="lg"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
      onMouseEnter={() => setIsCardHover(true)} // ホバー時に状態を更新
      onMouseLeave={() => setIsCardHover(false)} // ホバー解除時に状態を更新
      maxW={maxW}
    >
      <CardBody
        color={theme.colors.text.body}
        bg={theme.colors.background.card}
        borderRadius="md"
        className="flex items-start"
        style={{ padding: 0, border: "none" }}
      >
        <MapLeftThumbnail
          alt={map.title}
          fallbackSrc={`https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`}
          src={src}
          mapVideoId={map.videoId}
          mapPreviewTime={map.previewTime}
          thumbnailQuality={map.thumbnailQuality}
        />
        <MapCardRightInfo map={map} isCardHover={isCardHover} />
      </CardBody>
    </Card>
  );
}

export default MapCard;
