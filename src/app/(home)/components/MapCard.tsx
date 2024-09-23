"use client";
import { Card, CardBody, useTheme } from "@chakra-ui/react";

import MapLeftThumbnail from "./child/MapCardLeftThumbnail";
import MapCardRightInfo from "./child/MapCardRightInfo";
import { MapCardInfo } from "../ts/type";

interface MapCardProps {
  map: MapCardInfo;
}
function MapCard({ map }: MapCardProps) {
  const theme = useTheme();

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
    >
      <CardBody
        color={"color"}
        bg="home.card.bg"
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
        <MapCardRightInfo map={map} />
      </CardBody>
    </Card>
  );
}

export default MapCard;
