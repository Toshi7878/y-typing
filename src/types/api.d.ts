import { MapCardInfo } from "@/app/(home)/ts/type";

export interface GetInfoData {
  videoId: string;
  title: string;
  hasLike: boolean;
  artistName: string;
  creatorComment: string;
  musicSource: string;
  creatorId: number;
  tags?: string[];
  previewTime: string;
}

type NotificationSelect = {
  createdAt: Date;
  action: string;
  visitor_id: number;
  visitor: {
    name: string;
  };
  visitedResult: {
    score: number;
    rank: number;
  };
  visitorResult: {
    score: number;
    rank: number;
  };
  map: MapCardInfo;
};
