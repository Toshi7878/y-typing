"use server";

import { GetInfoData } from "@/types/api";
import "server-only";

export const getMapInfo = async (id: string): Promise<GetInfoData> => {
  if (id === "1") {
    return { videoId: "8iuYxdXFPbc", title: "君が代" };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};
