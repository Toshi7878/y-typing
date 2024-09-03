import { useDispatch, useSelector } from "react-redux";
import { useRefs } from "../edit-contexts/refsProvider";
import { RootState } from "../redux/store";
import {
  useEditAddLyricsTextAtom as useEditAddLyricsTextAtom,
  useIsEditYTPlayingAtom,
  useLineInputReducer,
  useSetEditLineLyricsAtom,
  useSpeedAtom,
  useSpeedReducer,
} from "../edit-atom/editAtom";
import { useSetTopLyricsText } from "./useEditAddLyricsTextHooks";
import { redo, undo } from "../redux/undoredoSlice";
import { mapDataRedo, mapDataUndo } from "../redux/mapDataSlice";
import { useUndoLine } from "./useEditUndoRedoHooks";
import { LineEdit } from "@/types";
import { useWordFindReplace } from "./useWordFindReplace";

export const useWindowKeydownEvent = () => {
  const { tbodyRef, playerRef, editorButtonsRef, editorTabRef } = useRefs();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const undoredoState = useSelector((state: RootState) => state.undoRedo);
  const speed = useSpeedAtom();
  const isYTPlaying = useIsEditYTPlayingAtom();
  const addLyricsText = useEditAddLyricsTextAtom();
  const dispatch = useDispatch();
  const lineInputReducer = useLineInputReducer();
  const speedReducer = useSpeedReducer();
  const setTopLyricsText = useSetTopLyricsText();
  const undoLine = useUndoLine();
  const wordFindReplace = useWordFindReplace();
  return (event: KeyboardEvent) => {
    const iS_FOCUS_TEXTAREA =
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement;

    if (!iS_FOCUS_TEXTAREA) {
      const player = playerRef!.current as any;

      switch (event.code) {
        case "ArrowUp":
          {
            const selectedLine = tbodyRef.current!.getElementsByClassName("selected-line")[0];

            if (selectedLine) {
              const prevCount = Number((selectedLine as HTMLElement).dataset.lineIndex) - 1;
              const prevLine = mapData[prevCount];
              if (prevLine) {
                player.seekTo(Number(prevLine.time));
                lineInputReducer({
                  type: "set",
                  payload: { lyrics: prevLine.lyrics, word: prevLine.word, selectCount: prevCount },
                });
              }
            }
          }
          event.preventDefault();

          break;

        case "ArrowDown":
          {
            const selectedLine = tbodyRef.current!.getElementsByClassName("selected-line")[0];

            if (selectedLine) {
              const nextCount = Number((selectedLine as HTMLElement).dataset.lineIndex) + 1;
              const nextLine = mapData[nextCount];

              if (nextLine) {
                player.seekTo(Number(nextLine.time));
                lineInputReducer({
                  type: "set",
                  payload: {
                    lyrics: nextLine.lyrics,
                    word: nextLine.word,
                    selectCount: nextCount,
                  },
                });
              }
            }
          }
          event.preventDefault();

          break;

        case "ArrowLeft":
          {
            const time = player.getCurrentTime();
            player.seekTo(time - 3 * speed);
            event.preventDefault();
          }

          break;

        case "ArrowRight":
          {
            const time = player.getCurrentTime();
            player.seekTo(time + 3 * speed);
            event.preventDefault();
          }

          break;

        case "KeyS":
          editorButtonsRef.current!.add();
          event.preventDefault();
          break;

        case "KeyU":
          editorButtonsRef.current!.update();
          event.preventDefault();
          break;

        case "KeyZ":
          if (event.ctrlKey) {
            if (undoredoState.present) {
              const data = undoredoState.present.data as LineEdit;

              dispatch(mapDataUndo(undoredoState.present));
              if (undoredoState.present.type === "add") {
                undoLine(data, addLyricsText);
                playerRef.current.seekTo(Number(data.time) - 3 * speed);
              }

              dispatch(undo());
              event.preventDefault();
            }
          }

          break;

        case "KeyY":
          if (event.ctrlKey) {
            if (undoredoState.future.length) {
              const future = undoredoState.future[undoredoState.future.length - 1];

              dispatch(mapDataRedo(future));

              if (future.type === "add") {
                const data = future.data as LineEdit;
                editorTabRef.current?.redoAddLyrics(data);
              }

              dispatch(redo());
              event.preventDefault();
            }
          }

          break;

        case "KeyD":
          lineInputReducer({ type: "reset" });
          event.preventDefault();

          break;

        case "Delete":
          editorButtonsRef.current!.delete();
          event.preventDefault();

          break;

        case "KeyQ":
          setTopLyricsText(undefined);
          event.preventDefault();

          break;

        case "KeyF":
          if (event.ctrlKey && event.shiftKey) {
            wordFindReplace();
            event.preventDefault();
          }
          break;

        case "Escape":
          if (!isYTPlaying) {
            player.playVideo();
          } else {
            player.pauseVideo();
          }

          event.preventDefault();

          break;

        case "F9":
          speedReducer("down");
          event.preventDefault();

          break;

        case "F10":
          speedReducer("up");
          event.preventDefault();

          break;
      }
    }
  };
};

export function useAddRubyTagEvent() {
  const setLyrics = useSetEditLineLyricsAtom();

  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const lyrics = event.currentTarget.value;
      const start = event.currentTarget.selectionStart;
      const end = event.currentTarget.selectionEnd;

      if (end === null || start === null || end - start < 1) {
        return false;
      }

      const addRubyTagLyrics = `${lyrics.slice(0, start)}<ruby>${lyrics.slice(start, end)}<rt></rt></ruby>${lyrics.slice(end, lyrics.length)}`;

      setLyrics(addRubyTagLyrics);
      setTimeout(() => {
        const target = event.target as HTMLInputElement;
        target.focus();
        target.setSelectionRange(
          addRubyTagLyrics.search("<rt></rt></ruby>") + 4,
          addRubyTagLyrics.search("<rt></rt></ruby>") + 4,
        );
      });
    }
  };
}
