import React, { cache } from "react";
import { RefsProvider } from "../(contexts)/refsProvider";
import Content from "./content";
import { GetInfoData } from "@/types/api";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";

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
  const session = await auth();
  const mapInfo = await getMapInfo(params.id);

  return (
    <SessionProvider session={session}>
      <RefsProvider>
        <Content mapInfo={mapInfo} />
      </RefsProvider>
    </SessionProvider>
  );
}
