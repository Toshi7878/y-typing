"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { resultSendSchema } from "./validationSchema";
import { SendResultData } from "./type";

const prisma = new PrismaClient();

const send = async (data: SendResultData, userId: number) => {
  const newResult = await prisma.result.create({
    data: {
      ...data,

      userId,

      lineResult: data.lineResult as unknown as Prisma.JsonObject, // 型キャストを修正
    },
  });
  return newResult.id; // 新しく作成されたマップのIDを返す
};

export async function actions(data: SendResultData) {
  const session = await auth();

  const validatedFields = resultSendSchema.safeParse({
    mapId: data.mapId,
    lineResult: data.lineResult,
    status: data.status,
  });

  if (!validatedFields.success) {
    return {
      id: null,
      message: validatedFields.error.errors[0].message,
      status: 400, // ステータスコードを追加
    };
  }
  try {
    const userId = Number(session?.user?.id);
    const newId = await send(data, userId);
    // リストの再検証をトリガー(更新されるようになる)
    // revalidatePath("/api/map-list");

    return {
      id: newId,
      message: "ランキング登録が完了しました",
      status: 200,
    };
  } catch (error) {
    return { id: null, message: "サーバー側で問題が発生しました", status: 500 };
  }
}
