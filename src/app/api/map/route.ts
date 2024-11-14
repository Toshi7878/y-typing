import { PrismaClient } from "@prisma/client";
import { getMapTypingData } from "@prisma/client/sql";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mapId = url.searchParams.get("id");

  if (!mapId) {
    return new Response("mapId is required", { status: 400 });
  }

  try {
    // const mapContents = await prisma.map.findUnique({
    //   where: { id: Number(mapId) },
    //   select: {
    //     mapData: true,
    //   },
    // });
    const mapContents = await prisma.$queryRawTyped(getMapTypingData(Number(mapId)));
    // const mapContents = await prisma.$queryRaw`
    //   SELECT "mapData"
    //   FROM "Map"
    //   WHERE id = ${Number(mapId)}
    // `;
    if (!mapContents) {
      return new Response("Map not found", { status: 404 });
    }

    return new Response(JSON.stringify(mapContents[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
