export interface MapCardInfo {
  id: number;
  title: string;
  artistName: string;
  musicSouce: string;
  videoId: string;
  updatedAt: string;
  previewTime: string;
  difficulty: string;
  thumbnailQuality: "maxresdefault" | "mqdefault";
  user: {
    id: number;
    name: string;
  };
}
