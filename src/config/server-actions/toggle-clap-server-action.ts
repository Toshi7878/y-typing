"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { UploadResult } from "@/types";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function updateClap(resultId: number, userId: number) {
  const clapedId = await prisma.$transaction(async (prisma) => {
    const isClaped = await prisma.clap.findUnique({
      where: {
        userId_resultId: {
          userId,
          resultId,
        },
      },
      select: {
        isClaped: true,
      },
    });

    const claped = await prisma.clap.upsert({
      where: {
        userId_resultId: {
          userId,
          resultId,
        },
      },
      update: {
        isClaped: !isClaped?.isClaped,
      },
      create: {
        userId,
        resultId,
        isClaped: true,
      },
    });

    const newClapCount = await prisma.clap.count({
      where: {
        resultId: resultId,
        isClaped: true, // resultIdのisClapedがtrueのものをカウント
      },
    });

    const updatedAt = await prisma.result.findUnique({
      where: {
        id: resultId,
      },
      select: {
        updatedAt: true,
      },
    });

    await prisma.result.update({
      where: {
        id: resultId,
      },
      data: {
        clapCount: newClapCount,
        updatedAt: updatedAt?.updatedAt,
      },
    });

    return claped.id;
  });

  return clapedId;
}

export async function toggleClapServerAction(resultId: number): Promise<UploadResult> {
  const session = await auth();

  try {
    const userId = Number(session?.user?.id);

    const clapedId = await updateClap(resultId, userId);

    revalidatePath(`/api/users-result-list`);

    return {
      id: clapedId,
      title: "拍手完了",
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
