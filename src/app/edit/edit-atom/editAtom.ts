import { atom, useAtomValue, useSetAtom } from "jotai";
import {
  ConvertOptionsType,
  EditTabIndex,
  LineInputReducerAction,
  TagsReducerAction,
  YTSpeedReducerActionType,
} from "../ts/type";
import { Tag, YouTubeSpeed } from "@/types";
import { atomWithReducer } from "jotai/utils"; // 追加
import { getEditAtomStore } from "../components/EditProvider";
import { useRefs } from "../edit-contexts/refsProvider";
import { DEFAULT_ADD_ADJUST_TIME } from "../ts/const/editDefaultValues";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
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

const editSpeedAtom = atom<YouTubeSpeed>(1);

export const useEditYTSpeedAtom = () => {
  return useAtomValue(editSpeedAtom, { store: editAtomStore });
};

const useSetEditYTSpeedAtom = () => {
  return useSetAtom(editSpeedAtom, { store: editAtomStore });
};

export const useSpeedReducer = () => {
  const speed = useEditYTSpeedAtom();
  const setYTSpeedAtom = useSetEditYTSpeedAtom();
  const { playerRef } = useRefs();

  return (actionType: YTSpeedReducerActionType) => {
    switch (actionType) {
      case "up":
        {
          const newSpeed = (speed < 2 ? speed + 0.25 : 2) as YouTubeSpeed;
          setYTSpeedAtom(newSpeed);
          playerRef.setPlaybackRate(newSpeed);
        }
        break;
      case "down":
        {
          const newSpeed = (speed > 0.25 ? speed - 0.25 : 0.25) as YouTubeSpeed;
          setYTSpeedAtom(newSpeed);
          playerRef.setPlaybackRate(newSpeed);
        }
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };
};

export const useSpeedAtom = () => {
  return useAtomValue(editSpeedAtom, { store: editAtomStore });
};

export const useSetSpeedAtom = () => {
  return useSetAtom(editSpeedAtom, { store: editAtomStore });
};

const isEditYouTubeReadyAtom = atom<boolean>(false);

export const useIsEditYTReadyAtom = () => {
  return useAtomValue(isEditYouTubeReadyAtom, { store: editAtomStore });
};

export const useSetIsEditYTReadyAtom = () => {
  return useSetAtom(isEditYouTubeReadyAtom, { store: editAtomStore });
};

const isEditYouTubeStartedAtom = atom<boolean>(false);

export const useIsEditYTStartedAtom = () => {
  return useAtomValue(isEditYouTubeStartedAtom, { store: editAtomStore });
};

export const useSetIsEditYTStartedAtom = () => {
  return useSetAtom(isEditYouTubeStartedAtom, { store: editAtomStore });
};

const isEditYouTubePlayingAtom = atom<boolean>(false);

export const useIsEditYTPlayingAtom = () => {
  return useAtomValue(isEditYouTubePlayingAtom, { store: editAtomStore });
};

export const useSetIsEditYTPlayingAtom = () => {
  return useSetAtom(isEditYouTubePlayingAtom, { store: editAtomStore });
};

const editLineLyricsAtom = atom<string>("");
const editLineWordAtom = atom<string>("");
const editLineSelectedCountAtom = atom<number | null>(null);

const isLineNotSelectAtom = atom<boolean>((get) => {
  const count = get(editLineSelectedCountAtom);
  return count === 0 || count === null;
});

export const useIsLineNotSelectAtom = () => {
  return useAtomValue(isLineNotSelectAtom, { store: editAtomStore });
};

export const useIsLineLastSelect = () => {
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const selectedLineCount = useEditLineSelectedCountAtom();
  const endAfterLineIndex =
    mapData.length -
    1 -
    mapData
      .slice()
      .reverse()
      .findIndex((line) => line.lyrics === "end");

  return selectedLineCount === endAfterLineIndex;
};

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
            editorTimeInputRef.current!.setSelectedTime(payload.selectCount);
            setEditLineCount(payload.selectCount);
          } else if (typeof payload.time === "string") {
            editorTimeInputRef.current!.setTime(payload.time);
          }
        }
        break;
      case "reset":
        editorTimeInputRef.current!.setSelectedTime(null);
        setEditLineLyrics("");
        setEditLineCount(null);
        setEditLineWord("");
        break;
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  };
};

const editTimeCountAtom = atom<number>(0);

export const useEditTimeCountAtom = () => {
  return useAtomValue(editTimeCountAtom, { store: editAtomStore });
};

export const useSetEditTimeCountAtom = () => {
  return useSetAtom(editTimeCountAtom, { store: editAtomStore });
};

const editAddLyricsTextAtom = atom<string>("");

export const useEditAddLyricsTextAtom = () => {
  return useAtomValue(editAddLyricsTextAtom, { store: editAtomStore });
};

export const useSetEditAddLyricsTextAtom = () => {
  return useSetAtom(editAddLyricsTextAtom, { store: editAtomStore });
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

const editIsTimeInputValidAtom = atom<boolean>(false);

export const useEditIsTimeInputValidAtom = () => {
  return useAtomValue(editIsTimeInputValidAtom, { store: editAtomStore });
};

export const useSetEditIsTimeInputValidAtom = () => {
  return useSetAtom(editIsTimeInputValidAtom, { store: editAtomStore });
};

const editPreviewTimeCountAtom = atom<number | null>(null);

export const useEditPreviewTimeCountAtom = () => {
  return useAtomValue(editPreviewTimeCountAtom, { store: editAtomStore });
};

export const useSetEditPreviewTimeCountAtom = () => {
  return useSetAtom(editPreviewTimeCountAtom, { store: editAtomStore });
};
