"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, Box, Spinner } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";

interface FetchMapList {
  id: number;
  title: string;
  videoId: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
}

async function fetchMapList(): Promise<FetchMapList[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-list`, {
    // cache: "no-cache", // キャッシュモード
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export default function Content() {
  const [mapList, setMapList] = useState<FetchMapList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapList()
      .then((data) => {
        setMapList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box className="grid md:grid-cols-1 lg:grid-cols-2 gap-3">
      {mapList.map((map) => (
        <Card
          key={map.id}
          className="rounded-lg transition-shadow duration-300 hover:shadow-lg hover:shadow-teal-500/50"
          maxW="2xl"
          size="lg"
        >
          <a href={`/type/${map.id}`}>
            <CardBody className="flex items-start bg-slate-300 rounded-lg" style={{ padding: 0 }}>
              <Image
                alt={map.title}
                className="cover rounded-lg"
                style={{ aspectRatio: "16/9" }}
                loading="lazy"
                src={`https://i.ytimg.com/vi_webp/${map.videoId}/mqdefault.webp`}
                width={220}
                height={120}
              />
              <Box className="ml-3 mt-2 font-bold sm:w-full md:w-[500px] text-lg">
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
    </Box>
  );
}
