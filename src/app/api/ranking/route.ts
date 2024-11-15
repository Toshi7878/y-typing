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
        id: true,
        mapId: false,
        userId: true,
        score: true,
        defaultSpeed: true,
        kpm: true,
        rkpm: true,
        romaKpm: true,
        romaType: true,
        kanaType: true,
        flickType: true,
        miss: true,
        lost: true,
        maxCombo: true,
        clearRate: true,
        updatedAt: true,
        user: {
          select: {
            name: true, // userからnameを取得
          },
        },
      },
      orderBy: { score: "desc" },
    });

    return new Response(JSON.stringify(rankingList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
