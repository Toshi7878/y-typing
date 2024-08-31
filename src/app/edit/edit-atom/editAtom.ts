import { atom, useAtomValue, useSetAtom } from "jotai";
import { EditTabIndex, SetTagsType } from "../ts/type";
import { Tag, YouTubeSpeed } from "@/types";
import { atomWithReducer } from "jotai/utils"; // 追加
import { getEditAtomStore } from "../components/EditProvider";
const editAtomStore = getEditAtomStore();

const editTabIndexAtom = atom<EditTabIndex>(0);
export const useTabIndexAtom = () => {
  return useAtomValue(editTabIndexAtom, { store: editAtomStore });
};

export const useSetTabIndexAtom = () => {
  return useSetAtom(editTabIndexAtom, { store: editAtomStore });
};

//タイトル
export const editMapTitleAtom = atom<string>("");

export const useMapTitleAtom = () => {
  return useAtomValue(editMapTitleAtom, { store: editAtomStore });
};

export const useSetMapTitleAtom = () => {
  return useSetAtom(editMapTitleAtom, { store: editAtomStore });
};

//動画ID
export const editVideoIdAtom = atom<string>("");

export const useVideoIdAtom = () => {
  return useAtomValue(editVideoIdAtom, { store: editAtomStore });
};

export const useSetVideoIdAtom = () => {
  return useSetAtom(editVideoIdAtom, { store: editAtomStore });
};

//制作者コメント
export const editCreatorCommentAtom = atom<string>("");

export const useCreatorCommentAtom = () => {
  return useAtomValue(editCreatorCommentAtom, { store: editAtomStore });
};

export const useSetCreatorCommentAtom = () => {
  return useSetAtom(editCreatorCommentAtom, { store: editAtomStore });
};

type TagsReducerAction = { type: SetTagsType; payload?: Tag | Tag[] };
const tagsReducer = (state: Tag[], action: TagsReducerAction): Tag[] => {
  switch (action.type) {
    case "set":
      const tags = action.payload as Tag[];
      return tags;
    case "add":
      if (action.payload && !Array.isArray(action.payload)) {
        return [...state, action.payload];
      }
    case "delete":
      if (!Array.isArray(action.payload)) {
        const deleteTag = action.payload as Tag; // 追加
        return state.filter((tag) => tag.id !== deleteTag.id);
      }
    case "reset":
      return [];
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const editTagsAtom = atomWithReducer<Tag[], TagsReducerAction>([], tagsReducer);

export const useTagsAtom = () => {
  return useAtomValue(editTagsAtom, { store: editAtomStore });
};

export const useSetTagsAtom = () => {
  return useSetAtom(editTagsAtom, { store: editAtomStore });
};

export const editCreatorIdAtom = atom<number | null>(null);

export const useCreatorIdAtom = () => {
  return useAtomValue(editCreatorIdAtom, { store: editAtomStore });
};

export const useSetCreatorIdAtom = () => {
  return useSetAtom(editCreatorIdAtom, { store: editAtomStore });
};

export const editSpeedAtom = atom<YouTubeSpeed>(1);

export const isEditYouTubeReadyAtom = atom<boolean>(false);
export const isEditYouTubeStartedAtom = atom<boolean>(false);
export const isEditYouTubePlayingAtom = atom<boolean>(false);

export const editLineLyricsAtom = atom<string>("");
export const editLineWordAtom = atom<string>("");
export const editLineTimeAtom = atom<number | null>(null);
export const editLineSelectedNumberAtom = atom<number | null>(null);
export const editTimeCountAtom = atom<number>(0);

export const editAddLyricsTextBoxAtom = atom<string>("");
export const editTimeRangeValue = atom<number>(0);
