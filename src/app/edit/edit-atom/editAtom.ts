import { atom, useAtomValue, useSetAtom } from "jotai";
import {
  ConvertOptionsType,
  EditTabIndex,
  LineInputReducerAction,
  TagsReducerActionType,
} from "../ts/type";
import { Tag, YouTubeSpeed } from "@/types";
import { atomWithReducer } from "jotai/utils"; // 追加
import { getEditAtomStore } from "../components/EditProvider";
import { useRefs } from "../edit-contexts/refsProvider";
import { DEFAULT_ADD_ADJUST_TIME } from "../ts/const/editDefaultValues";
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

type TagsReducerAction = { type: TagsReducerActionType; payload?: Tag | Tag[] };
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

const editLineLyricsAtom = atom<string>("");
const editLineWordAtom = atom<string>("");
const editLineSelectedCountAtom = atom<number | null>(null);

export const useEditLineLyricsAtom = () => {
  return useAtomValue(editLineLyricsAtom, { store: editAtomStore });
};
export const useEditLineWordAtom = () => {
  return useAtomValue(editLineWordAtom, { store: editAtomStore });
};
export const useEditLineSelectedCountAtom = () => {
  return useAtomValue(editLineSelectedCountAtom, { store: editAtomStore });
};

export const useSetEditLineLyricsAtom = () => {
  return useSetAtom(editLineLyricsAtom, { store: editAtomStore });
};
export const useSetEditLineWordAtom = () => {
  return useSetAtom(editLineWordAtom, { store: editAtomStore });
};
export const useSetEditLineSelectedCountAtom = () => {
  return useSetAtom(editLineSelectedCountAtom, { store: editAtomStore });
};

export const useLineInputReducer = () => {
  const setEditLineLyrics = useSetEditLineLyricsAtom();
  const setEditLineWord = useSetEditLineWordAtom();
  const { editorTimeInputRef } = useRefs();
  const setEditLineCount = useSetEditLineSelectedCountAtom();

  return ({ type, payload }: LineInputReducerAction) => {
    switch (type) {
      case "set":
        if (payload) {
          setEditLineWord(payload.word);
          if (typeof payload.lyrics === "string") {
            setEditLineLyrics(payload.lyrics);
          }
          if (typeof payload.selectCount === "number") {
            editorTimeInputRef.current!.selectedTime(payload.selectCount);
            setEditLineCount(payload.selectCount);
          }
        }
        break;
      case "reset":
        editorTimeInputRef.current!.selectedTime(null);
        setEditLineLyrics("");
        setEditLineCount(null);
        setEditLineWord("");
        break;
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  };
};

export const editTimeCountAtom = atom<number>(0);

const editAddLyricsInputAtom = atom<string>("");

export const useEditAddLyricsInputAtom = () => {
  return useAtomValue(editAddLyricsInputAtom, { store: editAtomStore });
};

export const useSetEditAddLyricsInputAtom = () => {
  return useSetAtom(editAddLyricsInputAtom, { store: editAtomStore });
};

const editIsLoadWordConvertAtom = atom<boolean>(false);

export const useIsLoadWordConvertAtom = () => {
  return useAtomValue(editIsLoadWordConvertAtom, { store: editAtomStore });
};

export const useSetIsLoadWordConvertAtom = () => {
  return useSetAtom(editIsLoadWordConvertAtom, { store: editAtomStore });
};

const editIsLrcConvertingAtom = atom<boolean>(false);

export const useIsLrcConvertingAtom = () => {
  return useAtomValue(editIsLrcConvertingAtom, { store: editAtomStore });
};

export const useSetIsLrcConvertingAtom = () => {
  return useSetAtom(editIsLrcConvertingAtom, { store: editAtomStore });
};

const editCanUploadAtom = atom<boolean>(false);

export const useCanUploadAtom = () => {
  return useAtomValue(editCanUploadAtom, { store: editAtomStore });
};

export const useSetCanUploadAtom = () => {
  return useSetAtom(editCanUploadAtom, { store: editAtomStore });
};

const editAddTimeOffsetAtom = atom<number>(DEFAULT_ADD_ADJUST_TIME);

export const useEditAddTimeOffsetAtom = () => {
  return useAtomValue(editAddTimeOffsetAtom, { store: editAtomStore });
};

export const useSetEditAddTimeOffsetAtom = () => {
  return useSetAtom(editAddTimeOffsetAtom, { store: editAtomStore });
};

const editWordConvertOptionAtom = atom<ConvertOptionsType>("non_symbol");

export const useEditWordConvertOptionAtom = () => {
  return useAtomValue(editWordConvertOptionAtom, { store: editAtomStore });
};

export const useSetEditWordConvertOptionAtom = () => {
  return useSetAtom(editWordConvertOptionAtom, { store: editAtomStore });
};
