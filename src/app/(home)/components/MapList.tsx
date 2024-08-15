"use client";
import { Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import MapCard from "./MapCard";

export interface MapCardInfo {
  id: number;
  title: string;
  videoId: string;
  updatedAt: string;
  previewTime: string;
  difficulty: string;
  thumbnailQuality: "maxresdefault" | "mqdefault";
  user: {
    id: number;
    name: string;
  };
}

async function getMapList(): Promise<MapCardInfo[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map-list`, {
    // cache: "no-cache", // キャッシュモード
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch data");
  }

  return response.data;
}

function MapList() {
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
        <MapCard key={map.id} map={map} />
      ))}
    </>
  );
}

export default MapList;
