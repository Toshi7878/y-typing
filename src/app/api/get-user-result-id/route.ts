import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get("userId")) || 0; // クエリからidを取得
  const mapId = Number(url.searchParams.get("mapId")) || 0; // クエリからidを取得

  try {
    const rankingList = await prisma.result.findFirst({
      where: {
        mapId,
        userId,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(rankingList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
