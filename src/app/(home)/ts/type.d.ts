export interface MapCardInfo {
  id: number;
  title: string;
  artistName: string;
  musicSource: string;
  videoId: string;
  updatedAt: Date;
  previewTime: string;
  difficulty: string;
  romaKpmMedian: number;
  romaKpmMax: number;
  totalTime: number;
  thumbnailQuality: "maxresdefault" | "mqdefault";
  user: {
    id: number;
    name: string;
  };
}
