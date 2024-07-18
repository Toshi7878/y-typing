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
  // const mapInfo = await getMapInfo(params.id);
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
