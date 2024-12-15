"use server";
import { GetInfoData } from "@/types/api";
import "server-only";
import { auth } from "../../server/auth";

export const getMapInfo = async (mapId: string): Promise<GetInfoData> => {
  const session = await auth();
  const userId = session?.user.id.toString() || "";

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info`);
  const params: Record<string, string> = { mapId, userId };

  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    cache: "no-cache",
  });

  return response.json();
};
