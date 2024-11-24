import UpdateAtText from "@/components/custom-chakra-ui/UpdateAtText";
import MapInfo from "@/components/map-card/child/child/MapInfo";
import MapLeftThumbnail from "@/components/map-card/child/MapCardLeftThumbnail";
import MapCardRightInfo from "@/components/map-card/child/MapCardRightInfo";
import MapCard from "@/components/map-card/MapCard";
import { NOTIFICATION_MAP_THUBNAIL_HEIGHT, NOTIFICATION_MAP_THUBNAIL_WIDTH } from "@/config/consts";
import { useNotifyQuery } from "@/lib/hooks/fetcher-hook/useNotifyQuery";
import {
  Box,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

const NotifyDrawerInnerContent = () => {
  const { data, isLoading } = useNotifyQuery();

  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>通知(仮)</DrawerHeader>

      <DrawerBody>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {data?.length ? (
              data.map((notify, index: number) => {
                const { map } = notify;
                const src =
                  map.thumbnailQuality === "maxresdefault"
                    ? `https://i.ytimg.com/vi_webp/${map.videoId}/maxresdefault.webp`
                    : `https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`;

                return (
                  <Box key={index}>
                    <Box>
                      <UpdateAtText updatedAt={notify.createdAt} />
                    </Box>
                    <Box>
                      {notify.visitor.name}さんが
                      {notify.visitedResult.rank - notify.visitorResult.rank}
                      位の記録を抜かしました。
                      <Box>スコア差: {notify.visitorResult.score - notify.visitedResult.score}</Box>
                    </Box>
                    <Box mb={2} maxW="610px">
                      <MapCard>
                        <MapLeftThumbnail
                          alt={map.title}
                          fallbackSrc={`https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`}
                          src={src}
                          mapVideoId={map.videoId}
                          mapPreviewTime={map.previewTime}
                          thumbnailQuality={map.thumbnailQuality}
                          thumnailWidth={NOTIFICATION_MAP_THUBNAIL_WIDTH}
                          thumnailHeight={NOTIFICATION_MAP_THUBNAIL_HEIGHT}
                        />
                        <MapCardRightInfo>
                          <MapInfo map={map} />
                        </MapCardRightInfo>
                      </MapCard>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box>通知はありません</Box>
            )}
          </>
        )}
      </DrawerBody>
    </>
  );
};

export default NotifyDrawerInnerContent;
