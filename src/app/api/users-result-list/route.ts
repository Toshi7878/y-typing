import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const CONTENT_LENGTH = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const offset = CONTENT_LENGTH * Number(page); // 20件ずつ読み込むように変更

  try {
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
    });

    return new Response(JSON.stringify(resultList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
