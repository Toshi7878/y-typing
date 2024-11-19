import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const checkVideoId = url.searchParams.get("videoId");
  const sessionId = await auth();
  const userId = Number(sessionId?.user.id);

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
    WHERE "Map"."videoId" = ${checkVideoId}
    ORDER BY "Map"."id" DESC`;

    if (!mapList) {
      return new Response("Map not found", { status: 404 });
    }

    return new Response(JSON.stringify(mapList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
