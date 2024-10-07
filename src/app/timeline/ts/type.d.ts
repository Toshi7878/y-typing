export interface ResultCardInfo {
  id: number;
  mapId: number;
  userId: number;
  updatedAt: Date;
  clearRate: number;
  score: number;
  miss: number;
  rank: number;
  kanaType: number;
  romaType: number;
  flickType: number;
  kpm: number;
  romaKpm: number;
  defaultSpeed: number;
  map: {
    id: number;
    videoId: string;
    title: string;
    artistName: string;
    previewTime: string;
    thumbnailQuality: "maxresdefault" | "mqdefault";
    updatedAt: Date;
    user: {
      id: number;
      name: string;
    };
  };
  user: {
    id: number;
    name: string;
  };
}
