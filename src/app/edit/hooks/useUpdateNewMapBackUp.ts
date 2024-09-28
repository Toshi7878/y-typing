import {
  useCreatorCommentAtom,
  useEditMusicSouceAtom,
  useEditPreviewTimeInputAtom,
  useMapArtistNameAtom,
  useMapTitleAtom,
  useTagsAtom,
} from "../edit-atom/editAtom";
import { sendEditorNewCreateBakIndexedDBData } from "@/lib/db";
import { Tag } from "@/types";
import { MapData } from "@/app/type/ts/type";

export const useUpdateNewMapBackUp = () => {
  const tags: Tag[] = useTagsAtom();
  const title = useMapTitleAtom();
  const artistName = useMapArtistNameAtom();
  const musicSouce = useEditMusicSouceAtom();
  const creatorComment = useCreatorCommentAtom();
  const previewTime = useEditPreviewTimeInputAtom();
  return (newVideoId: string, newMapData: MapData[]) => {
    sendEditorNewCreateBakIndexedDBData(
      {
        title,
        artistName,
        musicSouce,
        creatorComment,
        videoId: newVideoId,
        previewTime,
        tags: tags.map((tag: Tag) => tag.id),
      },
      newMapData,
    );
  };
};
