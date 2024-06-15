import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import Image from "next/image";

interface FetchMapList {
  id: number;
  title: string;
  videoId: string;
}

async function fetchMapList(): Promise<FetchMapList[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-list`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default async function Content() {
  const mapList = await fetchMapList();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-2 gap-4">
        {mapList.map((map) => (
          <div key={map.id} suppressHydrationWarning>
            <a suppressHydrationWarning href={`/edit/${map.id}`}>
              <Image
                alt="キミの冒険【YouTube Premium】"
                className="w-100"
                style={{ aspectRatio: "16/9" }}
                loading="lazy"
                src={`https://i.ytimg.com/vi_webp/${map.videoId}/mqdefault.webp`}
                width={320}
                height={180}
              />
              {map.title}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
