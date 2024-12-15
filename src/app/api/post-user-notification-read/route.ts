import { auth } from "@/server/auth";
import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = Number(session.user.id);

  await prisma.notification.updateMany({
    where: {
      visited_id: userId,
      checked: false,
    },
    data: {
      checked: true,
    },
  });

  return new Response("Notifications marked as read", { status: 200 });
}
