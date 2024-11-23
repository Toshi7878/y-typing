import { UploadResult } from "@/types";

export const DEFAULT_VOLUME = 30;

export const INITIAL_STATE: UploadResult = { id: null, title: "", message: "", status: 0 };

export const QUERY_KEYS = {
  mapList: ["mapList"] as const,
  usersResultList: ["usersResultList"] as const,
  mapData: (mapId: string | string[]) => ["mapData", mapId] as const,
  mapRanking: (mapId: string | string[]) => ["mapRanking", mapId] as const,
  userPlayData: (resultId: string | string[]) => ["userPlayData", resultId] as const,
  mapCreatedCheck: (videoId: string) => ["createdCheck", videoId] as const,
};
