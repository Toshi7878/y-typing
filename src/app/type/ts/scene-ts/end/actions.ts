"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { resultSendSchema } from "./validationSchema";
import { SendResultData } from "../../type";
import { UploadResult } from "@/types";

const prisma = new PrismaClient();

const send = async (data: SendResultData, userId: number) => {
  const existingResult = await prisma.result.findFirst({
    where: {
      mapId: data.mapId,
      userId: userId,
    },
  });

  if (existingResult) {
    const updatedResult = await prisma.result.update({
      where: { id: existingResult.id },
      data: {
        lineResult: data.lineResult as unknown as Prisma.JsonObject, // 型キャストを修正
        ...data.status,
      },
    });
    return updatedResult.id;
  } else {
    const newResult = await prisma.result.create({
      data: {
        mapId: data.mapId,
        userId,
        lineResult: data.lineResult as unknown as Prisma.JsonObject, // 型キャストを修正
        ...data.status,
      },
    });
    return newResult.id; // 新しく作成されたマップのIDを返す
  }
};

export async function actions(data: SendResultData): Promise<UploadResult> {
  const session = await auth();

  const validatedFields = resultSendSchema.safeParse({
    mapId: data.mapId,
    lineResult: data.lineResult,
    status: data.status,
  });

  if (!validatedFields.success) {
    return {
      id: null,
      title: "ランキングデータが正常ではありませんでした。",
      message: validatedFields.error.errors[0].message,
      status: 400,
    };
  }
  try {
    const userId = Number(session?.user?.id);
    const newId = await send(data, userId);

    return {
      id: newId,
      title: "ランキング登録が完了しました",
      status: 200,
    };
  } catch (error) {
    return { id: null, title: "サーバー側で問題が発生しました", status: 500 };
  }
}
