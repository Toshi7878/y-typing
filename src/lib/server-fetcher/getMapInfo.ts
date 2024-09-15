"use server";
import { GetInfoData } from "@/types/api";
import "server-only";
import { cache } from "react";

export const getMapInfo = cache(async (id: string): Promise<GetInfoData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${id}`, {
    next: { tags: ["map-info"] },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  return response.json();
});
