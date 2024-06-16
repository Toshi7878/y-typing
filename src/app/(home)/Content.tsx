import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import Image from "next/image";

interface FetchMapList {
  id: number;
  title: string;
  videoId: string;
}

async function fetchMapList(): Promise<FetchMapList[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-list`, {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default async function Content() {
  const mapList = await fetchMapList();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mapList.map((map) => (
          <Card key={map.id} variant={"outline"}>
            <a href={`/type/${map.id}`}>
              <CardBody className="flex items-start bg-slate-500" style={{ padding: 0 }}>
                <Image
                  suppressHydrationWarning
                  alt={map.title}
                  className="w-100 cover"
                  style={{ aspectRatio: "16/9" }}
                  loading="lazy"
                  src={`https://i.ytimg.com/vi_webp/${map.videoId}/mqdefault.webp`}
                  width={160}
                  height={90}
                />
                <div suppressHydrationWarning className="ml-4">
                  {map.title}
                </div>
              </CardBody>
            </a>
          </Card>
        ))}
      </div>
    </main>
  );
}
