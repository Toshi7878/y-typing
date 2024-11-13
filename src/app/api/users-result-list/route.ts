import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";
import {
  searchClearRate,
  searchKpm,
  searchSpeed,
  searchTypeMode,
  searchUserKeyWord,
} from "./searchParams";
import { FilterMode } from "@/app/timeline/ts/type";
import {
  DEFAULT_CLEAR_RATE_SEARCH_RANGE,
  DEFAULT_KPM_SEARCH_RANGE,
} from "@/app/timeline/ts/const/consts";

const prisma = new PrismaClient();

const CONTENT_LENGTH = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const mode = (searchParams.get("mode") ?? "all") as FilterMode;
  const mapKeyword = searchParams.get("map-keyword") ?? "";
  const userKey = searchParams.get("userKeyword") ?? "";
  const minKpm = Number(searchParams.get("minKpm") ?? DEFAULT_KPM_SEARCH_RANGE.min);
  const maxKpm = Number(searchParams.get("maxKpm"));
  const minClearRate = Number(
    searchParams.get("minClearRate") ?? DEFAULT_CLEAR_RATE_SEARCH_RANGE.min,
  );
  const maxClearRate = Number(searchParams.get("maxClearRate"));
  const minSpeed = Number(searchParams.get("minSpeed") ?? 1);
  const maxSpeed = Number(searchParams.get("maxSpeed"));

  const offset = CONTENT_LENGTH * Number(page); // 20件ずつ読み込むように変更

  try {
    const searchMode = searchTypeMode(mode);
    const userKeyWord = searchUserKeyWord(userKey);
    const kpm = searchKpm(minKpm, maxKpm);
    const clearRate = searchClearRate(minClearRate, maxClearRate);
    const speed = searchSpeed(minSpeed, maxSpeed);

    const resultList = await prisma.result.findMany({
      skip: offset,
      take: CONTENT_LENGTH,
      select: {
        id: true,
        mapId: true,
        userId: true,
        updatedAt: true,
        clearRate: true,
        score: true,
        miss: true,
        lost: true,
        rank: true,
        kanaType: true,
        romaType: true,
        flickType: true,
        kpm: true,
        romaKpm: true,
        defaultSpeed: true,
        map: {
          select: {
            id: true,
            videoId: true,
            title: true,
            artistName: true,
            previewTime: true,
            thumbnailQuality: true,
            updatedAt: true,

            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        ...searchMode,
        ...kpm,
        ...clearRate,
        ...speed,
        user: {
          ...userKeyWord,
        },
      },
    });

    return new Response(JSON.stringify(resultList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
