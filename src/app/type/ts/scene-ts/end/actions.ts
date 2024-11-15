"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { resultSendSchema } from "./validationSchema";
import { SendResultData } from "../../type";
import { UploadResult } from "@/types";

const prisma = new PrismaClient();

const calcRank = async (mapId: number) => {
  const rankingList = await prisma.result.findMany({
    where: {
      mapId: mapId,
    },
    select: {
      userId: true,
      score: true,
      updatedAt: true,
    },
    orderBy: { score: "desc" },
  });

  for (let i = 0; i < rankingList.length; i++) {
    await prisma.result.updateMany({
      where: {
        mapId: mapId,
        userId: rankingList[i].userId,
      },
      data: {
        rank: i + 1,
        updatedAt: rankingList[i].updatedAt, // 現在のupdatedAtの値を再設定
      },
    });
  }
};

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
        ...data.status,
      },
    });
    return updatedResult.id;
  } else {
    const newResult = await prisma.result.create({
      data: {
        mapId: data.mapId,
        userId,
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
    await calcRank(data.mapId);
    return {
      id: newId,
      title: "ランキング登録が完了しました",
      message: "",
      status: 200,
    };
  } catch (error) {
    return { id: null, title: "サーバー側で問題が発生しました", message: "", status: 500 };
  }
}
