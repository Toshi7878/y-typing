import Content from "./content";
import { Metadata } from "next";
import TypeProvider from "./TypeProvider";

import { GetInfoData } from "@/types/api";
import { cache } from "react";

const getMapInfo = cache(async (id: string): Promise<GetInfoData> => {
  if (id === "1") {
    return { videoId: "8iuYxdXFPbc", title: "君が代" };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${id}`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
});

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mapInfo = await getMapInfo(params.id);

  return {
    title: `${mapInfo.title} - YTyping`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const mapInfo = await getMapInfo(params.id);

  return (
    <TypeProvider>
      <Content mapInfo={mapInfo} />
    </TypeProvider>
  );
}
