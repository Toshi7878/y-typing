import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const CONTENT_LENGTH = 40;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const offset = CONTENT_LENGTH * Number(page); // 20件ずつ読み込むように変更
  try {
    //   const mapList = await prisma.$queryRaw`
    //   SELECT "Map"."id", "Map"."title", "Map"."artistName", "Map"."musicSource",
    //   "Map"."romaKpmMedian", "Map"."romaKpmMax", "Map"."videoId", "Map"."updatedAt",
    //   "Map"."previewTime", "Map"."totalTime", "Map"."thumbnailQuality",
    //   "User"."id" as "userId", "User"."name" as "userName"
    //   FROM "Map"
    //   JOIN "User" ON "Map"."userId" = "User"."id"
    //   ORDER BY "Map"."id" DESC
    //   LIMIT ${CONTENT_LENGTH} OFFSET ${offset}
    // `;
    const mapList = await prisma.map.findMany({
      skip: offset,
      take: CONTENT_LENGTH,
      select: {
        id: true,
        title: true,
        artistName: true,
        musicSource: true,
        romaKpmMedian: true,
        romaKpmMax: true,
        videoId: true,
        updatedAt: true,
        previewTime: true,
        totalTime: true,
        thumbnailQuality: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc", // 逆順で取得
      },
    });

    return new Response(JSON.stringify(mapList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
