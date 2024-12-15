"use server";

import { MapData } from "@/app/type/ts/type";
import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/server/auth";
import { UploadResult } from "@/types";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { EditorSendData } from "../../type";
import { mapSendSchema } from "./validationSchema";

const prisma = new PrismaClient();

const createMap = async (map: EditorSendData, userId: number) => {
  const newMap = await prisma.map.create({
    data: {
      ...map,
      creatorId: userId,
    },
  });
  return newMap.id; // 新しく作成されたマップのIDを返す
};

const updateMap = async (data: EditorSendData, mapId: number, isMapDataEdited: boolean) => {
  const updatedMap = await prisma.map.update({
    where: {
      id: mapId,
    },
    data: {
      ...data,
      ...(isMapDataEdited && { updatedAt: new Date() }),
    },
  });
  return updatedMap.id; // 更新されたマップのIDを返す
};

export async function actions(
  data: EditorSendData,
  mapData: MapData[],
  isMapDataEdited: boolean,
  mapId: string,
): Promise<UploadResult> {
  const session = await auth();

  const validatedFields = mapSendSchema.safeParse({
    title: data.title,
    creatorComment: data.creatorComment,
    previewTime: data.previewTime,
    tags: data.tags,
    mapData,
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
        newMapId = await updateMap(data, Number(mapId), isMapDataEdited);
      } else {
        return {
          id: null,
          title: "保存に失敗しました",
          message: "この譜面を保存する権限がありません",
          status: 403,
        };
      }
    }

    const jsonString = JSON.stringify(mapData, null, 2);

    // Supabaseストレージにアップロード
    await supabase.storage
      .from("map-data") // バケット名を指定
      .upload(
        `public/${mapId === "new" ? newMapId : mapId}.json`,
        new Blob([jsonString], { type: "application/json" }),
        {
          upsert: true, // 既存のファイルを上書きするオプションを追加
        },
      );

    revalidatePath(`/api/map-list`);
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
      errorObject: error instanceof Error ? error.message : String(error), // エラーオブジェクトを文字列に変換
    };
  }
}
