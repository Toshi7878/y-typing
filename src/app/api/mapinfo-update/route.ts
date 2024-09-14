import { GeminiMapInfo, GetYouTubeMovieInfo } from "@/app/edit/ts/type";
import { UploadResult } from "@/types";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

import { NextRequest } from "next/server";

const prisma = new PrismaClient();

const updateMap = async (mapInfoData: GeminiMapInfo, mapId: number) => {
  const updatedMap = await prisma.map.update({
    where: {
      id: mapId,
    },
    data: {
      title: mapInfoData.musicTitle,
      artistName: mapInfoData.artistName || "Unknown Artist", // artistNameがnullの場合にデフォルト値を設定
    },
  });
  return updatedMap.id; // 更新されたマップのIDを返す
};

export async function POST(req: NextRequest) {
  try {
    const mapList = await prisma.map.findMany({
      select: {
        id: true,
        videoId: true,
        artistName: true,
      },
      orderBy: {
        id: "desc", // 逆順で取得
      },
    });

    for (let i = 0; i < mapList.length; i++) {
      if (mapList[i].artistName) {
        continue;
      }
      const ytInfo = await axios.post<GetYouTubeMovieInfo | UploadResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-youtube-channel-info`,
        { videoId: mapList[i].videoId },
      );

      const geminiMapInfo = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate-map-info-gemini`,
        { prompt_post: ytInfo.data },
      );

      const mapInfoData: GeminiMapInfo = JSON.parse(geminiMapInfo.data.message);
      const mapId = mapList[i].id;

      const updateId = await updateMap(mapInfoData, mapId);

      console.log(
        `updateId:${updateId} title:${mapInfoData.musicTitle} artistName:${mapInfoData.artistName}`,
      );
    }

    return new Response(JSON.stringify(mapList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching map list:", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
