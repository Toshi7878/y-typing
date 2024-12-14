import { sendEditorNewCreateBakIndexedDBData } from "@/lib/db";
import { Tag } from "@/types";
import { useStore as useJotaiStore } from "jotai";
import { useStore as useReduxStore } from "react-redux";
import {
  editCreatorCommentAtom,
  editMapArtistNameAtom,
  editMapTitleAtom,
  editMusicSourceAtom,
  editPreviewTimeInputAtom,
  editTagsAtom,
} from "../edit-atom/editAtom";

import { RootState } from "../redux/store";

export const useUpdateNewMapBackUp = () => {
  const editAtomStore = useJotaiStore();
  const editReduxStore = useReduxStore<RootState>();

  return (newVideoId: string) => {
    const mapData = editReduxStore.getState().mapData.value;
    const tags = editAtomStore.get(editTagsAtom);
    const title = editAtomStore.get(editMapTitleAtom);
    const artistName = editAtomStore.get(editMapArtistNameAtom);
    const musicSource = editAtomStore.get(editMusicSourceAtom);
    const creatorComment = editAtomStore.get(editCreatorCommentAtom);
    const previewTime = editAtomStore.get(editPreviewTimeInputAtom);

    sendEditorNewCreateBakIndexedDBData(
      {
        title,
        artistName,
        musicSource,
        creatorComment,
        videoId: newVideoId,
        previewTime,
        tags: tags.map((tag: Tag) => tag.id),
      },
      mapData,
    );
  };
};
