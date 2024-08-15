"use client";
import { Card, CardBody, useTheme } from "@chakra-ui/react";

import MapLeftThumbnail from "./child/MapCardLeftThumbnail";
import MapCardRightInfo from "./child/MapCardRightInfo";
import { MapCardInfo } from "./MapList";

interface MapCardProps {
  map: MapCardInfo;
}
function MapCard({ map }: MapCardProps) {
  const theme = useTheme();

  return (
    <Card
      key={map.id}
      maxW="2xl"
      borderRadius="lg"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
      size="lg"
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
          src={`https://i.ytimg.com/vi/${map.videoId}/maxresdefault.jpg`}
          mapVideoId={map.videoId}
          mapPreviewTime={map.previewTime}
        />
        <MapCardRightInfo map={map} />
      </CardBody>
    </Card>
  );
}

export default MapCard;
