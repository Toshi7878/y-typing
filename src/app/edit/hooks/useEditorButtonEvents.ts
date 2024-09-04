import { useDispatch, useSelector } from "react-redux";
import {
  useEditAddTimeOffsetAtom,
  useEditLineLyricsAtom,
  useEditLineSelectedCountAtom,
  useEditLineWordAtom,
  useEditWordConvertOptionAtom,
  useIsEditYTPlayingAtom,
  useLineInputReducer,
  useSetCanUploadAtom,
  useSetIsLoadWordConvertAtom,
} from "../edit-atom/editAtom";
import { useDeleteTopLyricsText } from "./useEditAddLyricsTextHooks";
import { RootState } from "../redux/store";
import { setLastAddedTime } from "../redux/mapDataSlice";
import { useRefs } from "../edit-contexts/refsProvider";
import { ButtonEvents } from "../ts/tab/editor/buttonEvent";
import { addHistory } from "../redux/undoredoSlice";

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

  const { editorTimeInputRef } = useRefs();
  const setCanUpload = useSetCanUploadAtom();

  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();
  const deleteTopLyricsText = useDeleteTopLyricsText();

  return (event: React.MouseEvent<HTMLButtonElement>) => {
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

    const lyricsCopy = structuredClone(lyrics);
    dispatch(setLastAddedTime(time));
    ButtonEvents.addLine(dispatch, setCanUpload, { time, lyrics, word });

    if (!event.shiftKey) {
      lineInputReducer({ type: "reset" });
    }

    deleteTopLyricsText(lyricsCopy);

    //フォーカスを外さないとクリック時にテーブルがスクロールされない
    (document.activeElement as HTMLElement)?.blur();
  };
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

  return (event: React.MouseEvent<HTMLButtonElement>) => {
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

    ButtonEvents.updateLine(dispatch, {
      time,
      lyrics,
      word,
      selectedLineCount: selectedLineCount ?? undefined,
    });
    lineInputReducer({ type: "reset" });
  };
};

export const useWordConvertButtonEvent = () => {
  const lyrics = useEditLineLyricsAtom();
  const convertOption = useEditWordConvertOptionAtom();
  const lineInputReducer = useLineInputReducer();
  const setIsLoadWordConvert = useSetIsLoadWordConvertAtom();
  return async () => {
    setIsLoadWordConvert(true);
    const word = await ButtonEvents.lyricsConvert(lyrics, convertOption);
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

  return () => {
    if (selectedLineCount) {
      ButtonEvents.deleteLine(dispatch, setCanUpload, {
        ...mapData[selectedLineCount],
        selectedLineCount: selectedLineCount,
      });
    }
    lineInputReducer({ type: "reset" });
  };
};
