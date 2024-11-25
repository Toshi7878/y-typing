import UpdateAtText from "@/components/custom-ui/UpdateAtText";
import NotificationMapInfo from "@/components/map-card-notification/child/child/NotificationMapInfo";
import NotificationMapCardLeftThumbnail from "@/components/map-card-notification/child/NotificationMapCardLeftThumbnail";
import NotificationMapCardRightInfo from "@/components/map-card-notification/child/NotificationMapCardRightInfo";
import NotificationMapCard from "@/components/map-card-notification/NotificationMapCard";
import { NOTIFICATION_MAP_THUBNAIL_HEIGHT, NOTIFICATION_MAP_THUBNAIL_WIDTH } from "@/config/consts";
import { useNotifyQuery } from "@/lib/hooks/fetcher-hook/useNotifyQuery";
import { ThemeColors } from "@/types";
import {
  Box,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  Spinner,
  useTheme,
} from "@chakra-ui/react";
import React from "react";

const NotifyDrawerInnerContent = () => {
  const { data, isLoading } = useNotifyQuery();

  const theme: ThemeColors = useTheme();

  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>通知(仮)</DrawerHeader>

      <DrawerBody px={3}>
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
                  <Box key={index} mb={4}>
                    <Box mb={2}>
                      <NotificationMapCard notify={notify}>
                        <NotificationMapCardLeftThumbnail
                          alt={map.title}
                          fallbackSrc={`https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`}
                          src={src}
                          mapVideoId={map.videoId}
                          mapPreviewTime={map.previewTime}
                          thumbnailQuality={map.thumbnailQuality}
                          thumnailWidth={NOTIFICATION_MAP_THUBNAIL_WIDTH}
                          thumnailHeight={NOTIFICATION_MAP_THUBNAIL_HEIGHT}
                        />
                        <NotificationMapCardRightInfo>
                          <NotificationMapInfo map={map} />
                        </NotificationMapCardRightInfo>
                      </NotificationMapCard>
                      <Box textAlign="end" color={`${theme.colors.text.body}cc`}>
                        <UpdateAtText updatedAt={notify.createdAt} />
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box>まだ通知はありません</Box>
            )}
          </>
        )}
      </DrawerBody>
    </>
  );
};

export default NotifyDrawerInnerContent;
