import React from "react";
import { RefsProvider } from "../(contexts)/refsProvider";
import Content from "./content";
import { GetInfoData } from "@/types/api";

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

  let mapInfo;

  if (params.id != "3") {
    mapInfo = await getMapInfo(params.id);
  } else {
    mapInfo = {
      videoId: "e7uuVlmCZKk",
      title: "Superman / Tampalay",
      creatorComment: "",
      tags: ["Superman", "Tampalay", "公式動画"],
    };
  }

  return (
    <RefsProvider>
      <Content mapInfo={mapInfo} />
    </RefsProvider>
  );
}
