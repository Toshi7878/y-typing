import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    for (let n = 0; n < 999; n++) {
      const rankingList = await prisma.result.findMany({
        where: {
          mapId: n,
        },
        select: {
          userId: true,
          score: true,
        },
        orderBy: { score: "desc" },
      });

      for (let i = 0; i < rankingList.length; i++) {
        await prisma.result.updateMany({
          where: {
            mapId: n,
            userId: rankingList[i].userId,
          },
          data: {
            rank: i + 1, // mapDataをunknownに変換してからJsonObjectにキャスト
          },
        });
      }

      console.log(n);
    }

    // return new Response(JSON.stringify(rankingList), {
    //   headers: { "Content-Type": "application/json" },
    // });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
