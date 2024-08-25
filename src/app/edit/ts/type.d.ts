export interface EditorSendData {
  title: string;
  creatorComment: string;
  tags: string[];
  mapData: Line[];
  videoId: string;
  previewTime: string;
  romaKpmMedian: number;
  romaKpmMax: number;
  kanaKpmMedian: number;
  kanaKpmMax: number;
  totalTime: number;
  romaTotalNotes: number;
  kanaTotalNotes: number;
  thumbnailQuality: "maxresdefault" | "mqdefault";
}
