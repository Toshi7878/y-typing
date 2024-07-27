import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);

  const mapId = parseInt(url.searchParams.get("mapId") || "0", 10);
  const userId = parseInt(url.searchParams.get("userId") || "0", 10);

  try {
    const result = await prisma.result.findFirst({
      where: {
        userId: userId,
        mapId: mapId,
      },
      select: {
        lineResult: true,
        status: true,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "リプレイデータが見つかりません" }, { status: 404 });
    }

    return NextResponse.json({
      lineResult: result.lineResult,
      status: result.status,
    });
  } catch (error) {
    console.error("リプレイデータの取得中にエラーが発生しました:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
