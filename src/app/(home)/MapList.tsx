"use client";
import { Card, CardBody, Box, Spinner } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface GetMapList {
  id: number;
  title: string;
  videoId: string;
  updatedAt: string;
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

export default function MapList() {
  const { data: mapList = [], isLoading } = useQuery({
    queryKey: ["mapList"],
    queryFn: getMapList,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {mapList.map((map) => (
        <Card
          key={map.id}
          className="rounded-lg transition-shadow duration-300 hover:shadow-lg hover:shadow-teal-500/50"
          maxW="2xl"
          size="lg"
        >
          <a href={`/type/${map.id}`}>
            <CardBody className="flex items-start bg-slate-300 rounded-lg" style={{ padding: 0 }}>
              <Box>
                <Image
                  alt={map.title}
                  className="cover rounded-lg"
                  style={{ aspectRatio: "16/9" }}
                  loading="lazy"
                  layout={"responsive"}
                  src={`https://i.ytimg.com/vi_webp/${map.videoId}/mqdefault.webp`}
                  width={220}
                  height={120}
                />
              </Box>

              <Box className="ml-3 mt-2 font-bold w-full text-xs sm:text-sm md:text-md lg:text-lg">
                <div className="text-teal-700 hover:underline">
                  <a href={`/type/${map.id}`}>{map.title}</a>
                </div>

                <div>
                  <a className="text-teal-700 hover:underline" href={`/users/${map.user.id}`}>
                    {map.user.name}
                  </a>

                  <small>
                    {" "}
                    - {formatDistanceToNowStrict(new Date(map.updatedAt), { addSuffix: true })}
                  </small>
                </div>
              </Box>
            </CardBody>
          </a>
        </Card>
      ))}
    </>
  );
}
