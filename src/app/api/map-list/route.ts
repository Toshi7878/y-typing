import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const mapList = await prisma.map.findMany({
      select: {
        id: true,
        title: true,
        creatorComment: false,
        genre: false,
        tags: false,
        mapData: false,
        videoId: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
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
