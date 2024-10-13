import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const CONTENT_LENGTH = 40;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const offset = CONTENT_LENGTH * Number(page); // 20件ずつ読み込むように変更
  try {
    const mapList = await prisma.map.findMany({
      skip: offset,
      take: CONTENT_LENGTH,
      select: {
        id: true,
        title: true,
        artistName: true,
        musicSouce: true,
        creatorComment: false,
        tags: false,
        mapData: false,
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
