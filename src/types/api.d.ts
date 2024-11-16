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
