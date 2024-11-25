import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mapId = Number(url.searchParams.get("mapId"));
  const userId = Number(url.searchParams.get("userId"));
  if (!mapId) {
    return new Response("mapId is required", { status: 400 });
  }

  try {
    const mapContents = await prisma.map.findUnique({
      where: { id: mapId },
      select: {
        title: true,
        artistName: true,
        musicSource: true,
        creatorComment: true,
        creatorId: true,
        tags: true,
        videoId: true,
        previewTime: true,
        mapLike: {
          where: { userId },
          select: { isLiked: true },
        },
      },
    });

    if (!mapContents) {
      return new Response("Map not found", { status: 404 });
    }

    return new Response(JSON.stringify(mapContents), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
