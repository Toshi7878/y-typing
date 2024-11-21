"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { UploadResult } from "@/types";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function updateLike(mapId: number, userId: number, optimisticState: boolean) {
  const likedId = await prisma.$transaction(async (prisma) => {
    const claped = await prisma.mapLike.upsert({
      where: {
        userId_mapId: {
          userId,
          mapId,
        },
      },
      update: {
        isLiked: optimisticState,
      },
      create: {
        userId,
        mapId,
        isLiked: true,
      },
    });

    const newLikeCount = await prisma.mapLike.count({
      where: {
        mapId: mapId,
        isLiked: true, // resultIdのisClapedがtrueのものをカウント
      },
    });

    const updatedAt = await prisma.map.findUnique({
      where: {
        id: mapId,
      },
      select: {
        updatedAt: true,
      },
    });

    await prisma.map.update({
      where: {
        id: mapId,
      },
      data: {
        likeCount: newLikeCount,
        updatedAt: updatedAt?.updatedAt,
      },
    });

    return claped.id;
  });

  return likedId;
}

export async function toggleLikeServerAction(
  mapId: number,
  optimisticState: boolean,
): Promise<UploadResult> {
  const session = await auth();

  try {
    const userId = Number(session?.user?.id);

    const likedId = await updateLike(mapId, userId, optimisticState);

    return {
      id: likedId,
      title: "いいね完了",
      message: "",
      status: 200,
    };
  } catch (error) {
    return {
      id: null,
      title: "サーバー側で問題が発生しました",
      message: "しばらく時間をおいてから再度お試しください。",
      status: 500,
      errorObject: error instanceof Error ? error.message : String(error), // エラーオブジェクトを文字列に変換
    };
  }
}
