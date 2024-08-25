"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { mapSendSchema } from "./validationSchema";
import { revalidatePath } from "next/cache";
import { EditorSendData } from "../../type";

const prisma = new PrismaClient();

const createMap = async (data: EditorSendData, userId: number) => {
  const newMap = await prisma.map.create({
    data: {
      ...data,
      creatorId: userId,
      mapData: data.mapData as unknown as Prisma.JsonObject, // mapDataをunknownに変換してからJsonObjectにキャスト
    },
  });
  return newMap.id; // 新しく作成されたマップのIDを返す
};

const updateMap = async (data: EditorSendData, mapId: number) => {
  const updatedMap = await prisma.map.update({
    where: {
      id: mapId,
    },
    data: {
      ...data,
      mapData: data.mapData as unknown as Prisma.JsonObject, // mapDataをunknownに変換してからJsonObjectにキャスト
    },
  });
  return updatedMap.id; // 更新されたマップのIDを返す
};

export async function actions(data: EditorSendData, mapId: string) {
  const session = await auth();

  const validatedFields = mapSendSchema.safeParse({
    title: data.title,
    creatorComment: data.creatorComment,
    tags: data.tags,
    mapData: data.mapData,
    videoId: data.videoId,
    thumbnailQuality: data.thumbnailQuality,
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
    let newMapId: number;
    if (mapId === "new") {
      newMapId = await createMap(data, userId);
      // リストの再検証をトリガー(更新されるようになる)
      revalidatePath("/api/map-list");
    } else {
      newMapId = await updateMap(data, Number(mapId));
    }

    return {
      id: newMapId,
      message: mapId === "new" ? "アップロード完了" : "アップデート完了",
      status: 200,
    };
  } catch (error) {
    return { id: null, message: "サーバー側で問題が発生しました", status: 500 };
  }
}
