"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { resultSendSchema } from "./validationSchema";
import { SendResultData } from "../../type";
import { UploadResult } from "@/types";

const prisma = new PrismaClient();

const calcRank = async (mapId: number, userId: number) => {
  const rankingList = await prisma.result.findMany({
    where: {
      mapId: mapId,
    },
    select: {
      userId: true,
      score: true,
      rank: true,
      updatedAt: true,
    },
    orderBy: { score: "desc" },
  });

  for (let i = 0; i < rankingList.length; i++) {
    const newRank = i + 1;

    await prisma.result.updateMany({
      where: {
        mapId: mapId,
        userId: rankingList[i].userId,
      },
      data: {
        rank: newRank,
        updatedAt: rankingList[i].updatedAt, // 現在のupdatedAtの値を再設定
      },
    });

    const isOtherUser = rankingList[i].userId !== userId;
    if (isOtherUser && rankingList[i].rank <= 5 && rankingList[i].rank !== newRank) {
      await prisma.notification.upsert({
        where: {
          visitor_id_visited_id_mapId_action: {
            visitor_id: userId,
            visited_id: rankingList[i].userId,
            mapId: mapId,
            action: "ot",
          },
        },
        update: {
          checked: false,
          createdAt: new Date(),
        },
        create: {
          visitor_id: userId,
          visited_id: rankingList[i].userId,
          mapId: mapId,
          action: "ot",
        },
      });
    }
  }

  const mapData = await prisma.map.findUnique({
    where: {
      id: mapId,
    },
    select: {
      updatedAt: true,
    },
  });

  await prisma.map.update({
    where: {
      id: mapId,
    },
    data: {
      rankingCount: rankingList.length,
      updatedAt: mapData?.updatedAt,
    },
  });
};

const sendNewResult = async (data: SendResultData, userId: number) => {
  const upsertResult = await prisma.result.upsert({
    where: {
      userId_mapId: {
        userId: userId,
        mapId: data.mapId,
      },
    },
    update: {
      ...data.status,
    },
    create: {
      mapId: data.mapId,
      userId,
      ...data.status,
    },
  });

  return upsertResult.id;
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
    const newId = await sendNewResult(data, userId);
    await calcRank(data.mapId, userId);
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
