"use client";
import { Card, CardBody, Box, Spinner, useTheme, Text } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useAtom, useSetAtom } from "jotai";
import { previewTimeAtom, videoIdAtom } from "./atoms/atoms";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { handleLinkClick } from "../nprogress";
import { ja } from "date-fns/locale";

interface GetMapList {
  id: number;
  title: string;
  videoId: string;
  updatedAt: string;
  previewTime: string;
  difficulty: string;
  user: {
    id: number;
    name: string;
  };
}

async function getMapList(): Promise<GetMapList[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map-list`, {
    // cache: "no-cache", // キャッシュモード
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch data");
  }

  return response.data;
}

function MapList() {
  const router = useRouter();
  const theme = useTheme();

  const [videoId, setVideoId] = useAtom(videoIdAtom);
  const setPreviewTime = useSetAtom(previewTimeAtom);
  const { data: mapList = [], isLoading } = useQuery({
    queryKey: ["mapList"],
    queryFn: getMapList,
  });

  if (isLoading) {
    return <Spinner />;
  }

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
    <>
      {mapList.map((map) => (
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
              <Image
                alt={map.title}
                className="cover rounded-md"
                style={{ aspectRatio: "16/9" }}
                loading="lazy"
                layout={"responsive"}
                src={`https://i.ytimg.com/vi/${map.videoId}/mqdefault.jpg`}
                width={220}
                height={120}
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
              className="pl-3 pt-2 w-full text-xs sm:text-sm md:text-md lg:text-lg flex flex-col justify-start h-full"
            >
              <Box color={"home.card.link"} className="hover:underline font-bold">
                {map.title}
              </Box>

              <small>
                <Link
                  className="hover:underline"
                  href={`/user/${map.user.id}`}
                  onClick={handleLinkClick(`/user/${map.user.id}`, router)}
                >
                  <Text as="span" color={"home.card.link"}>
                    {map.user.name}
                  </Text>
                </Link>

                <span className="text-xs">
                  {" "}
                  -{" "}
                  {formatDistanceToNowStrict(new Date(map.updatedAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </span>
              </small>
            </Link>
          </CardBody>
        </Card>
      ))}
    </>
  );
}

export default MapList;
