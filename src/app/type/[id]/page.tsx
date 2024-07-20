import React from "react";
import { RefsProvider } from "../(contexts)/refsProvider";
import Content from "./content";
import { GetInfoData } from "@/types/api";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

async function getMapInfo(id: string): Promise<GetInfoData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${id}`, {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  const mapInfo = params.id !== "9" ? await getMapInfo(params.id) : { videoId: "wGtX3nYpBkE" };

  return (
    <SessionProvider session={session}>
      <RefsProvider>
        <Content mapInfo={mapInfo} />
      </RefsProvider>
    </SessionProvider>
  );
}
