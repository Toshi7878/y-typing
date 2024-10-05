import { useDispatch, useSelector } from "react-redux";
import {
  useEditAddTimeOffsetAtom,
  useEditIsTimeInputValidAtom,
  useEditLineLyricsAtom,
  useEditLineSelectedCountAtom,
  useEditLineWordAtom,
  useIsEditYTPlayingAtom,
  useIsLineLastSelect,
  useIsLineNotSelectAtom,
  useLineInputReducer,
  useSetCanUploadAtom,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { useDeleteTopLyricsText } from "./useEditAddLyricsTextHooks";
import { RootState } from "../redux/store";
import { setLastAddedTime, setMapData } from "../redux/mapDataSlice";
import { useRefs } from "../edit-contexts/refsProvider";
import { addHistory } from "../redux/undoredoSlice";
import { useWordConvert } from "./useWordConvert";
import { useSearchParams } from "next/navigation";
import { useUpdateNewMapBackUp } from "./useUpdateNewMapBackUp";

const timeValidate = (
  time: number,
  mapData: RootState["mapData"]["value"],
  endAfterLineIndex: number,
) => {
  const lastLineTime = Number(mapData[endAfterLineIndex]["time"]);

  if (0 >= time) {
    return 0.001;
  } else if (lastLineTime <= time) {
    return lastLineTime - 0.001;
  } else {
    return time;
  }
};

export const useLineAddButtonEvent = () => {
  const isYTPlaying = useIsEditYTPlayingAtom();
  const addTimeOffset = useEditAddTimeOffsetAtom();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const lyrics = useEditLineLyricsAtom();
  const word = useEditLineWordAtom();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";
  const updateNewMapBackUp = useUpdateNewMapBackUp();
  const dispatch = useDispatch();

  const { editorTimeInputRef, playerRef } = useRefs();
  const setCanUpload = useSetCanUploadAtom();
  const lineInputReducer = useLineInputReducer();
  const deleteTopLyricsText = useDeleteTopLyricsText();
  const endAfterLineIndex =
    mapData.length -
    1 -
    mapData
      .slice()
      .reverse()
      .findIndex((line) => line.lyrics === "end");

  return async (isShiftKey: boolean) => {
    const timeOffset = isYTPlaying ? Number(addTimeOffset) : 0;
    const time_ = isYTPlaying
      ? playerRef.current.getCurrentTime()
      : editorTimeInputRef.current!.getTime();

    const time = timeValidate(time_ + timeOffset, mapData, endAfterLineIndex).toFixed(3);
    const newLine = !isShiftKey ? { time, lyrics, word } : { time, lyrics: "", word: "" };
    const addLineMap = [...mapData, newLine].sort(
      (a, b) => parseFloat(a.time) - parseFloat(b.time),
    );

    dispatch(setLastAddedTime(time));
    dispatch(setMapData(addLineMap));
    dispatch(addHistory({ type: "add", data: newLine }));

    if (newVideoId) {
      updateNewMapBackUp(newVideoId, addLineMap);
    }

    if (!isShiftKey) {
      lineInputReducer({ type: "reset" });

      const lyricsCopy = structuredClone(lyrics);
      deleteTopLyricsText(lyricsCopy);
    }

    setCanUpload(true);

    //フォーカスを外さないとクリック時にテーブルがスクロールされない
    (document.activeElement as HTMLElement)?.blur();
  };
};

export const useLineUpdateButtonEvent = () => {
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const lyrics = useEditLineLyricsAtom();
  const word = useEditLineWordAtom();
  const selectedLineCount = useEditLineSelectedCountAtom() as number;
  const { editorTimeInputRef, playerRef } = useRefs();
  const setCanUpload = useSetCanUploadAtom();
  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";
  const updateNewMapBackUp = useUpdateNewMapBackUp();
  const isYTPlaying = useIsEditYTPlayingAtom();
  const addTimeOffset = useEditAddTimeOffsetAtom();

  const endAfterLineIndex =
    mapData.length -
    1 -
    mapData
      .slice()
      .reverse()
      .findIndex((line) => line.lyrics === "end");
  return async () => {
    const timeOffset = isYTPlaying ? Number(addTimeOffset) : 0;
    const time_ =
      isYTPlaying && !selectedLineCount
        ? playerRef.current.getCurrentTime()
        : editorTimeInputRef.current!.getTime();

    const time = timeValidate(time_ + timeOffset, mapData, endAfterLineIndex).toFixed(3);

    const updatedLine = {
      time,
      lyrics,
      word,
      ...(mapData[selectedLineCount].options && {
        options: mapData[selectedLineCount].options,
      }),
    };

    const newValue = [
      ...mapData.slice(0, selectedLineCount),
      updatedLine,
      ...mapData.slice(selectedLineCount + 1),
    ].sort((a, b) => parseFloat(a.time) - parseFloat(b.time));

    setCanUpload(true);
    dispatch(
      addHistory({
        type: "update",
        data: {
          old: mapData[selectedLineCount!],
          new: { time, lyrics, word },
          lineNumber: selectedLineCount,
        },
      }),
    );

    dispatch(setMapData(newValue));

    if (newVideoId) {
      updateNewMapBackUp(newVideoId, newValue);
    }

    lineInputReducer({ type: "reset" });
  };
};

export const useWordConvertButtonEvent = () => {
  const lyrics = useEditLineLyricsAtom();
  const lineInputReducer = useLineInputReducer();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  const wordConvert = useWordConvert();

  return async () => {
    setIsLoadWordConvert(true);
    const word = await wordConvert(lyrics);
    setIsLoadWordConvert(false);
    lineInputReducer({ type: "set", payload: { word } });
  };
};

export const useLineDelete = () => {
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const selectedLineCount = useEditLineSelectedCountAtom();
  const setCanUpload = useSetCanUploadAtom();
  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();

  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";
  const updateNewMapBackUp = useUpdateNewMapBackUp();

  return () => {
    if (selectedLineCount) {
      const newValue = mapData.filter((_, index) => index !== selectedLineCount);

      dispatch(setMapData(newValue));
      setCanUpload(true);
      dispatch(
        addHistory({
          type: "delete",
          data: {
            ...mapData[selectedLineCount],
            selectedLineCount: selectedLineCount,
          },
        }),
      );

      if (newVideoId) {
        updateNewMapBackUp(newVideoId, newValue);
      }
    }

    lineInputReducer({ type: "reset" });
  };
};

export const useIsAddButtonDisabled = () => {
  const isTimeInputValid = useEditIsTimeInputValidAtom();
  return !isTimeInputValid;
};

export const useIsUpdateButtonDisabled = () => {
  const isTimeInputValid = useEditIsTimeInputValidAtom();
  const isLineNotSelect = useIsLineNotSelectAtom();
  const isLineLastSelect = useIsLineLastSelect();

  return !isTimeInputValid || isLineNotSelect || isLineLastSelect;
};

export const useIsConvertButtonDisabled = () => {
  const isLineLastSelect = useIsLineLastSelect();
  return isLineLastSelect;
};

export const useIsDeleteButtonDisabled = () => {
  const isTimeInputValid = useEditIsTimeInputValidAtom();
  const isLineNotSelect = useIsLineNotSelectAtom();
  const isLineLastSelect = useIsLineLastSelect();

  return !isTimeInputValid || isLineNotSelect || isLineLastSelect;
};
