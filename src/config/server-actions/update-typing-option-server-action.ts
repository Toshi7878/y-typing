"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { UploadResult } from "@/types";
import { UserTypingOptions } from "@/app/type/ts/type";

const prisma = new PrismaClient();

async function updateTypingOption(userId: number, updateData: UserTypingOptions) {
  const updated = await prisma.typingOption.upsert({
    where: {
      userId,
    },
    update: {
      ...updateData,
    },
    create: {
      userId,
      ...updateData,
    },
  });

  return updated.id;
}

export async function updateTypingOptionServerAction(
  updateData: UserTypingOptions,
): Promise<UploadResult> {
  const session = await auth();

  try {
    const userId = Number(session?.user?.id);

    const likedId = await updateTypingOption(userId, updateData);

    return {
      id: likedId,
      title: "アップデート完了",
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
