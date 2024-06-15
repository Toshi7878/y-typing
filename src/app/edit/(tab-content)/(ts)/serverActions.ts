"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { SendData } from "../TabInfoUpload";
import { mapSendSchema } from "./validationSchema";

const prisma = new PrismaClient();

const sendMapData = async (data: SendData, userId: number) => {
  const newMap = await prisma.map.create({
    data: {
      ...data,
      creatorId: userId,
      mapData: data.mapData as unknown as Prisma.JsonObject, // mapDataをunknownに変換してからJsonObjectにキャスト
    },
  });
  return newMap.id; // 新しく作成されたマップのIDを返す
};

export async function actions(data: SendData) {
  const session = await auth();

  const validatedFields = mapSendSchema.safeParse({
    title: data.title,
    creatorComment: data.creatorComment,
    genre: data.genre,
    tags: data.tags,
    mapData: data.mapData,
    videoId: data.videoId,
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
    const newMapId = await sendMapData(data, userId);
    return { id: newMapId, message: "アップロード完了", status: 200 };
  } catch (error) {
    return { id: null, message: "サーバー側で問題が発生しました", status: 500 };
  }
}
