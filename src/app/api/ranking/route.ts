import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get("id") || "0", 10); // クエリからidを取得

  try {
    const rankingList = await prisma.result.findMany({
      where: {
        mapId: id, // mapIdが1のカラムを取得
      },
      select: {
        mapId: false,
        userId: true,
        status: true,
        score: true,
        lineResult: false, // lineResultを追加
        updatedAt: true,
        user: {
          select: {
            name: true, // userからnameを取得
          },
        },
      },
      orderBy: {},
    });

    return new Response(JSON.stringify(rankingList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
