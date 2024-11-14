import { getMapList } from "@/sql";
import { PrismaClient } from "@prisma/client";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const CONTENT_LENGTH = 40;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "0";
  const offset = CONTENT_LENGTH * Number(page); // 20件ずつ読み込むように変更
  try {
    const mapList = await prisma.$queryRawTyped(getMapList(CONTENT_LENGTH, offset));

    return new Response(JSON.stringify(mapList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
