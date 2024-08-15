"use client";
import { Card, CardBody, Box, useTheme, Text, Tooltip } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";

import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ja } from "date-fns/locale";
import { Link } from "@chakra-ui/next-js";
import { handleLinkClick } from "@/app/nprogress";
import ImageWithFallback from "./ThumbnailImage";
import { MapCardInfo } from "../MapList";
import { previewTimeAtom, videoIdAtom } from "../atoms/atoms";
import { useAtom, useSetAtom } from "jotai";

interface MapCardProps {
  map: MapCardInfo;
}
function MapCard({ map }: MapCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const [videoId, setVideoId] = useAtom(videoIdAtom);
  const setPreviewTime = useSetAtom(previewTimeAtom);

  const previewYouTube = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const target = e.currentTarget as HTMLDivElement;
    const targetPreviewTime = target.getAttribute("data-preview-time");
    const targetVideoId = target.getAttribute("data-video-id");

    if (targetVideoId !== videoId) {
      setVideoId(targetVideoId);
      setPreviewTime(targetPreviewTime);
    } else {
      setVideoId(null);
      setPreviewTime(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLDivElement;
    if (target && target.getAttribute("data-video-id") === videoId) {
      setVideoId(target.getAttribute("data-video-id"));
      setPreviewTime(target.getAttribute("data-preview-time"));
    }
  };
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
        <Box className="relative group">
          <ImageWithFallback
            alt={map.title}
            fallbackSrc={`https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`}
            src={`https://i.ytimg.com/vi/${map.videoId}/maxresdefault.jpg`}
          />
          <Box
            className={`cursor-pointer absolute inset-0 flex items-center justify-center ${
              videoId === map.videoId ? "opacity-100" : "opacity-0"
            } group-hover:opacity-100 transition-opacity duration-300`}
            style={{
              backgroundColor:
                videoId === map.videoId ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.3)",
              border: "none",
            }}
            borderRadius="lg"
            data-preview-time={map.previewTime}
            data-video-id={map.videoId}
            onClick={previewYouTube}
            onTouchEnd={handleTouchEnd}
          >
            {videoId === map.videoId ? (
              <FaPause color="white" size={35} />
            ) : (
              <FaPlay color="white" size={35} />
            )}
          </Box>
        </Box>

        <Link
          href={`/type/${map.id}`}
          onClick={handleLinkClick(`/type/${map.id}`, router)}
          className="pl-3 pt-2 text-xs sm:text-sm md:text-md lg:text-lg flex flex-col justify-start h-full"
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
            borderColor={theme.colors.type.card.borderColor}
            css={{
              "--popper-arrow-bg": theme.colors.popup.bg,
              "--popper-arrow-shadow-color": theme.colors.type.card.borderColor,
            }}
          >
            <Box
              color={"home.card.link"}
              fontWeight="bold"
              className="hover:underline"
              maxW="440px"
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
      </CardBody>
    </Card>
  );
}

export default MapCard;