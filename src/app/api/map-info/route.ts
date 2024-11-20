import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mapId = Number(url.searchParams.get("mapId"));
  const userId = Number(url.searchParams.get("userId"));
  if (!mapId) {
    return new Response("mapId is required", { status: 400 });
  }

  try {
    const mapContents = await prisma.$queryRaw`
    SELECT
    "Map"."title",
    "Map"."artistName",
    "Map"."musicSource",
    "Map"."creatorComment",
    "Map"."creatorId",
    "Map"."tags",
    "Map"."videoId",
    "Map"."previewTime",
    (
        SELECT "isLiked"
        FROM "MapLike"
        WHERE "MapLike"."mapId" = "Map"."id"
        AND "MapLike"."userId" = ${userId}
        LIMIT 1
      ) as "hasLike"
    FROM "Map"
    WHERE "Map"."id" = ${Number(mapId)}
  `;

    if (!mapContents) {
      return new Response("Map not found", { status: 404 });
    }

    return new Response(JSON.stringify(mapContents[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
