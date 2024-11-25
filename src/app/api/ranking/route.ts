import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await auth();
  const userId = Number(session?.user?.id);
  const id = parseInt(url.searchParams.get("id") || "0", 10); // クエリからidを取得

  try {
    const rankingList = await prisma.result.findMany({
      where: {
        mapId: id,
      },
      select: {
        id: true,
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
        clapCount: true,
        clearRate: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
          },
        },
        clap: {
          where: {
            userId: userId ? userId : undefined,
          },
          select: {
            isClaped: true,
          },
        },
      },
      orderBy: {
        score: "desc",
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
