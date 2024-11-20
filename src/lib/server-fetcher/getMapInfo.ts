"use server";
import { GetInfoData } from "@/types/api";
import "server-only";
import { cache } from "react";
import { auth } from "../auth";

export const getMapInfo = cache(async (mapId: string): Promise<GetInfoData> => {
  const session = await auth();

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info`);
  const params: Record<string, string> = { mapId: mapId.toString() };
  if (session?.user.id) {
    params.userId = session.user.id.toString();
  }

  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  return response.json();
});
