import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get("userId")) || 0; // クエリからidを取得

  try {
    const notifyList = await prisma.notification.findMany({
      where: {
        visited_id: userId,
      },
      orderBy: {
        createdAt: "desc", // 作成日時の新しい順にソート
      },
      select: {
        createdAt: true,
        action: true,
        visitor_id: true,
        oldRank: true,
        visitor: {
          select: {
            name: true,
          },
        },
        visitedResult: {
          select: {
            score: true,
          },
        },
        visitorResult: {
          select: {
            score: true,
          },
        },
        map: {
          select: {
            id: true,
            title: true,
            artistName: true,
            musicSource: true,
            romaKpmMedian: true,
            romaKpmMax: true,
            videoId: true,
            creatorId: true,
            updatedAt: true,
            previewTime: true,
            totalTime: true,
            thumbnailQuality: true,
            likeCount: true,
            rankingCount: true,
            mapLike: {
              where: {
                userId,
              },
              select: {
                isLiked: true,
              },
            },
            result: {
              where: {
                userId,
              },
              select: {
                rank: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    await prisma.notification.updateMany({
      where: {
        visited_id: userId,
        checked: false,
      },
      data: {
        checked: true,
      },
    });

    return new Response(JSON.stringify(notifyList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
