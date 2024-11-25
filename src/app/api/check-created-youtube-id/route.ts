import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const checkVideoId = url.searchParams.get("videoId") || "";
  const sessionId = await auth();
  const userId = Number(sessionId?.user.id);

  try {
    const mapList = await prisma.map.findMany({
      where: {
        videoId: checkVideoId,
      },
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
        likeCount: true,
        rankingCount: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
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
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!mapList) {
      return new Response("Map not found", { status: 404 });
    }

    return new Response(JSON.stringify(mapList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
