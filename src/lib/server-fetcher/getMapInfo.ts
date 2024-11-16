"use server";
import { GetInfoData } from "@/types/api";
import "server-only";
import { cache } from "react";

export const getMapInfo = cache(
  async (id: string, sessionId: number | null): Promise<GetInfoData> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${id}&sessionid=${sessionId}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
);
