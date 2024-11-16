"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { UploadResult } from "@/types";

const prisma = new PrismaClient();

async function updateClapCount(resultId: number) {
  const newClapCount = await prisma.clap.count({
    where: {
      resultId: resultId,
      isClaped: true, // resultIdのisClapedがtrueのものをカウント
    },
  });

  await prisma.result.update({
    where: {
      id: resultId,
    },
    data: {
      clapCount: newClapCount,
    },
    select: {
      updatedAt: false, // updatedAtを更新しない
    },
  });
}

export async function toggleClapServerAction(resultId: number): Promise<UploadResult> {
  const session = await auth();

  try {
    const userId = Number(session?.user?.id);

    const claped = await prisma.clap.upsert({
      where: {
        userId_resultId: {
          userId,
          resultId,
        },
      },
      update: {
        isClaped: true,
      },
      create: {
        userId,
        resultId,
        isClaped: true,
      },
    });

    await updateClapCount(resultId);

    return {
      id: claped.id,
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
