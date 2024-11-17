import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    for (let i = 1; i < 300; i++) {
      const rankingList = await prisma.result.findMany({
        where: {
          mapId: i,
        },
        select: {
          score: true,
        },
      });

      await prisma.map.update({
        where: {
          id: i,
        },
        data: {
          rankingCount: rankingList.length,
        },
      });

      console.log(`id:${i}, rankingCount:${rankingList.length}`);
    }

    return new Response(JSON.stringify("all done"), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
