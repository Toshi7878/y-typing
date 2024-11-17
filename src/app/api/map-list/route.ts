import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const CONTENT_LENGTH = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const userId = Number(session?.user?.id);

  const page = searchParams.get("page") ?? "0";
  const mapKeyword = searchParams.get("mapKeyword") ?? "";
  const offset = CONTENT_LENGTH * Number(page); // 20件ずつ読み込むように変更
  try {
    const mapList = await prisma.$queryRaw`
    SELECT
    "Map"."id",
    "Map"."title",
    "Map"."artistName",
    "Map"."musicSource",
    "Map"."romaKpmMedian",
    "Map"."romaKpmMax",
    "Map"."videoId",
    "Map"."updatedAt",
    "Map"."previewTime",
    "Map"."totalTime",
    "Map"."thumbnailQuality",
    "Map"."likeCount",
    "Map"."rankingCount",
    json_build_object('id', "User"."id", 'name', "User"."name") as "user",
    (
        SELECT "isLiked"
        FROM "MapLike"
        WHERE "MapLike"."mapId" = "Map"."id"
        AND "MapLike"."userId" = ${userId}
        LIMIT 1
    ) as "hasLike",
    (
        SELECT "rank"
        FROM "Result"
        WHERE "Result"."mapId" = "Map"."id"
        AND "Result"."userId" = ${userId}
        LIMIT 1
    ) as "myRank"
    FROM "Map"
    JOIN "User" ON "Map"."creatorId" = "User"."id"
    WHERE (
            CASE
              WHEN ${mapKeyword} != '' THEN "title" &@~ ${mapKeyword}
              OR "artistName" &@~ ${mapKeyword}
              OR "musicSource" &@~ ${mapKeyword}
              OR "tags" &@~ ${mapKeyword}
              OR "User"."name" &@~ ${mapKeyword}
              ELSE 1=1
              END
          )
    ORDER BY "Map"."id" DESC
    LIMIT ${CONTENT_LENGTH} OFFSET ${offset}`;

    return new Response(JSON.stringify(mapList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
