import { MapCardInfo } from "@/app/(home)/ts/type";

export interface GetInfoData {
  videoId: string;
  title: string;
  artistName: string;
  creatorComment: string;
  musicSource: string;
  creatorId: number;
  tags?: string[];
  previewTime: string;
  mapLike: {
    isLiked: boolean;
  }[];
}

type NotificationSelect = {
  createdAt: Date;
  action: string;
  visitor_id: number;
  oldRank: number;
  visitor: {
    name: string;
  };
  visitedResult: {
    score: number;
  };
  visitorResult: {
    score: number;
  };
  map: MapCardInfo;
};
