import { HOME_THUBNAIL_HEIGHT, HOME_THUBNAIL_WIDTH } from "@/app/(home)/ts/const/consts";
import MapLeftThumbnail from "@/components/map-card/child/MapCardLeftThumbnail";
import MapCardRightInfo from "@/components/map-card/child/MapCardRightInfo";
import MapCard from "@/components/map-card/MapCard";
import { useCreatedCheckVideoIdQuery } from "@/lib/hooks/fetcher-hook/useCreatedCheckVideoIdQuery";
import { Box, Spinner } from "@chakra-ui/react";
import React from "react";

interface CreatedCheckProps {
  videoId: string;
}

const CreatedCheck = (props: CreatedCheckProps) => {
  const { data, error, isLoading } = useCreatedCheckVideoIdQuery(props.videoId);

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (data && data.length) {
    return (
      <Box>
        <Box fontSize="lg" fontWeight="bold" my={3}>
          この動画の譜面が{data.length}件見つかりました
        </Box>
        {data.map((map, index) => {
          const src =
            map.thumbnailQuality === "maxresdefault"
              ? `https://i.ytimg.com/vi_webp/${map.videoId}/maxresdefault.webp`
              : `https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`;

          return (
            <Box key={index} mb={2} maxW="610px">
              <MapCard>
                <MapLeftThumbnail
                  alt={map.title}
                  fallbackSrc={`https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`}
                  src={src}
                  mapVideoId={map.videoId}
                  mapPreviewTime={map.previewTime}
                  thumbnailQuality={map.thumbnailQuality}
                  thumnailWidth={HOME_THUBNAIL_WIDTH}
                  thumnailHeight={HOME_THUBNAIL_HEIGHT}
                />
                <MapCardRightInfo map={map} />
              </MapCard>
            </Box>
          );
        })}
      </Box>
    );
  } else {
    return (
      <Box fontSize="lg" fontWeight="bold" my={3}>
        この動画の譜面は見つかりませんでした
      </Box>
    );
  }
};

export default CreatedCheck;
