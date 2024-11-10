"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { mapSendSchema } from "./validationSchema";
import { revalidatePath } from "next/cache";
import { EditorSendData } from "../../type";
import { UploadResult } from "@/types";

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

export async function actions(data: EditorSendData, mapId: string): Promise<UploadResult> {
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
      title: "保存に失敗しました",
      message: validatedFields.error.errors[0].message,
      status: 400,
    };
  }
  try {
    const userId = Number(session?.user?.id);
    let newMapId: number;

    if (mapId === "new") {
      newMapId = await createMap(data, userId);
    } else {
      const mapCreatorId = await prisma.map.findUnique({
        where: { id: Number(mapId) },
        select: {
          creatorId: true,
        },
      });

      const userRole = session?.user.role;

      if (mapCreatorId?.creatorId === userId || userRole === "admin") {
        newMapId = await updateMap(data, Number(mapId));
      } else {
        return {
          id: null,
          title: "保存に失敗しました",
          message: "この譜面を保存する権限がありません",
          status: 403,
        };
      }
    }
    revalidatePath(`/api/map-list?page=0`);
    return {
      id: mapId === "new" ? newMapId : null,
      title: mapId === "new" ? "アップロード完了" : "アップデート完了",
      message: "",
      status: 200,
    };
  } catch (error) {
    return {
      id: null,
      title: "サーバー側で問題が発生しました",
      message: "しばらく時間をおいてから再度お試しください。",
      status: 500,
      errorObject: error,
    };
  }
}
