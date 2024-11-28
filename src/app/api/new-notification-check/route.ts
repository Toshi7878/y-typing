import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get("userId"));

  try {
    const firstNewNotification = await prisma.notification.findFirst({
      where: {
        visited_id: userId,
        checked: false,
      },
      select: {
        checked: true,
      },
    });

    if (!firstNewNotification) {
      return new Response("Map not found", { status: 404 });
    }

    return new Response(JSON.stringify(firstNewNotification), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
