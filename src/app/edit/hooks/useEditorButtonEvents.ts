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
import { addLine, deleteLine, setLastAddedTime, updateLine } from "../redux/mapDataSlice";
import { useRefs } from "../edit-contexts/refsProvider";
import { addHistory } from "../redux/undoredoSlice";
import { useWordConvert } from "./useWordConvert";

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

export const useIsAddButtonDisabled = () => {
  const isTimeInputValid = useEditIsTimeInputValidAtom();
  return !isTimeInputValid;
};

export const useLineAddButtonEvent = () => {
  const isYTPlaying = useIsEditYTPlayingAtom();
  const addTimeOffset = useEditAddTimeOffsetAtom();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const lyrics = useEditLineLyricsAtom();
  const word = useEditLineWordAtom();

  const { editorTimeInputRef } = useRefs();
  const setCanUpload = useSetCanUploadAtom();
  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();
  const deleteTopLyricsText = useDeleteTopLyricsText();

  return (isShiftKey: boolean) => {
    const timeOffset = isYTPlaying ? Number(addTimeOffset) : 0;
    const endAfterLineIndex =
      mapData.length -
      1 -
      mapData
        .slice()
        .reverse()
        .findIndex((line) => line.lyrics === "end");

    const time = timeValidate(
      editorTimeInputRef.current!.getTime() + timeOffset,
      mapData,
      endAfterLineIndex,
    ).toFixed(3);
    dispatch(setLastAddedTime(time));

    const newLine = !isShiftKey ? { time, lyrics, word } : { time, lyrics: "", word: "" };
    dispatch(addLine(newLine));
    dispatch(addHistory({ type: "add", data: newLine }));
    if (!isShiftKey) {
      lineInputReducer({ type: "reset" });
    }

    const lyricsCopy = !isShiftKey ? structuredClone(lyrics) : "";
    deleteTopLyricsText(lyricsCopy);

    setCanUpload(true);
    //フォーカスを外さないとクリック時にテーブルがスクロールされない
    (document.activeElement as HTMLElement)?.blur();
  };
};

export const useIsUpdateButtonDisabled = () => {
  const isTimeInputValid = useEditIsTimeInputValidAtom();
  const isLineNotSelect = useIsLineNotSelectAtom();
  const isLineLastSelect = useIsLineLastSelect();

  return !isTimeInputValid || isLineNotSelect || isLineLastSelect;
};

export const useLineUpdateButtonEvent = () => {
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const lyrics = useEditLineLyricsAtom();
  const word = useEditLineWordAtom();
  const selectedLineCount = useEditLineSelectedCountAtom();

  const { editorTimeInputRef } = useRefs();
  const setCanUpload = useSetCanUploadAtom();

  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();

  return () => {
    const endAfterLineIndex =
      mapData.length -
      1 -
      mapData
        .slice()
        .reverse()
        .findIndex((line) => line.lyrics === "end");
    const time = timeValidate(
      editorTimeInputRef.current!.getTime(),
      mapData,
      endAfterLineIndex,
    ).toFixed(3);

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

    dispatch(
      updateLine({
        time,
        lyrics,
        word,
        selectedLineCount: selectedLineCount ?? undefined,
      }),
    );
    lineInputReducer({ type: "reset" });
  };
};

export const useIsConvertButtonDisabled = () => {
  const isLineLastSelect = useIsLineLastSelect();

  return isLineLastSelect;
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

export const useIsDeleteButtonDisabled = () => {
  const isTimeInputValid = useEditIsTimeInputValidAtom();
  const isLineNotSelect = useIsLineNotSelectAtom();
  const isLineLastSelect = useIsLineLastSelect();

  return !isTimeInputValid || isLineNotSelect || isLineLastSelect;
};

export const useLineDelete = () => {
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const selectedLineCount = useEditLineSelectedCountAtom();
  const setCanUpload = useSetCanUploadAtom();
  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();

  return () => {
    if (selectedLineCount) {
      dispatch(deleteLine(selectedLineCount));
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
    }
    lineInputReducer({ type: "reset" });
  };
};
