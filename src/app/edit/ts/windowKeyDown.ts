import { Action } from "@reduxjs/toolkit";
import { YTSpeedController } from "./youtube-ts/editYtHandleEvents";
import { RootState } from "../redux/store";
import { RefsContextType } from "../edit-contexts/refsProvider";
import { mapDataRedo, mapDataUndo, updateLine } from "../redux/mapDataSlice";
import { addHistory, redo, undo } from "../redux/undoredoSlice";
import { LineEdit, YouTubeSpeed } from "@/types";
import { Dispatch } from "react";
import { LineInputReducerAction } from "./type";
import { useSetEditLineLyricsAtom } from "../edit-atom/editAtom";
class WordReplace {
  mapData: RootState["mapData"]["value"];
  tbodyRef: RefsContextType["tbodyRef"];
  dispatch: Dispatch<Action>;
  setCanUpload: Dispatch<boolean>;
  newWord: string;

  constructor(
    mapData: RootState["mapData"]["value"],
    tbodyRef: RefsContextType["tbodyRef"],
    dispatch: Dispatch<Action>,
    setCanUpload: Dispatch<boolean>,
  ) {
    this.mapData = mapData;
    this.tbodyRef = tbodyRef;
    this.dispatch = dispatch;
    this.setCanUpload = setCanUpload;
    this.newWord = "";
  }

  async wordSearchReplace() {
    const search = this.escapeRegExp(prompt("置き換えしたい読みを入力してください。"));

    if (!search) {
      return;
    }

    let matchLength = this.getKanaSearchLength(new RegExp(search, "g"));
    const replace = prompt("置き換えする文字を入力してください。");
    if (!replace) {
      return;
    }

    const searchReg = new RegExp(`${replace ? `(?!${replace})` : ""}${search}`, "g");

    if (search && replace.match(search)) {
      alert("sorry...置き換えする文字に検索する文字が含まないようにしてください。");
      return;
    }
    for (let i = 0, len = this.mapData.length; i < len; i++) {
      const match = this.mapData[i]["word"].match(searchReg);
      if (!match) {
        continue;
      }
      let replacedWord = this.mapData[i]["word"];
      let replacedLength = 0;

      for (let j = 1; j < match.length + 1; j++) {
        await this.replaceFoundFocus(i, search);
        await this.replaceDialog(i, searchReg, replace, matchLength);
        replacedWord = replacedWord.replace(search, "");
        replacedLength += search.length;
        matchLength--;
      }
    }
  }

  getKanaSearchLength(searchReg) {
    let lyricsKana = "";

    for (let i = 0, len = this.mapData.length; i < len; i++) {
      lyricsKana += this.mapData[i]["word"];
    }

    const Result = lyricsKana.match(searchReg);

    return Result ? Result.length : 0;
  }

  replaceFoundFocus(i, search) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const targetRow = this.tbodyRef.current?.children[i];

        if (targetRow) {
          targetRow.scrollIntoView({ behavior: "auto", block: "center" });
        }

        let range = document.createRange();

        // 取得した要素の内側を範囲とする
        const WORD_NODE = this.tbodyRef.current?.children[i].children[2];
        if (WORD_NODE && WORD_NODE.textContent) {
          this.newWord = WORD_NODE.textContent;
          const textMatch = WORD_NODE.textContent.match(new RegExp(search));
          if (textMatch) {
            range.selectNodeContents(WORD_NODE);
          }
          if (WORD_NODE && WORD_NODE.firstChild && textMatch && textMatch.index !== undefined) {
            // 範囲を選択状態にする
            range.setStart(WORD_NODE.firstChild, textMatch.index);
            range.setEnd(WORD_NODE.firstChild, textMatch.index + (textMatch[0]?.length || 0));

            // 選択範囲をクリアして新しい範囲を追加
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              console.error("選択オブジェクトが見つかりませんでした。");
            }
          } else {
            console.error("WORD_NODE または textMatch が見つかりませんでした。");
          }
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            console.error("選択オブジェクトが見つかりませんでした。");
          }

          resolve(1);
          console.error("検索語が見つかりませんでした。");
          resolve(0);
        }
      }, 50);
    });
  }

  replaceDialog(i, searchReg, replace, matchLength) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (confirm(`残り${matchLength}件\n${this.newWord}\n置き換えますか？`)) {
          let n = 0;

          const lineNumber = i;

          const time = this.mapData[i]["time"];

          const lyrics = this.mapData[i]["lyrics"];

          const newWord = this.newWord.replace(searchReg, (match) => {
            if (++n == 1) return replace;
            else return match;
          });

          this.setCanUpload(true);
          this.dispatch(
            addHistory({
              type: "update",
              data: {
                old: { time, lyrics, word: this.newWord },
                new: { time, lyrics, word: newWord },
                lineNumber: i,
              },
            }),
          );

          this.newWord = newWord;

          this.dispatch(updateLine({ lineNumber, time, lyrics, word: this.newWord }));
        }

        resolve(1);
      }, 50);
    });
  }

  escapeRegExp(string) {
    return string ? string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&") : null;
  }
}

export const handleKeydown = (
  event: KeyboardEvent,
  refs: RefsContextType,
  undoredoState: RootState["undoRedo"],
  dispatch: Dispatch<Action>,
  mapData: RootState["mapData"]["value"],
  speed: YouTubeSpeed,
  setSpeed: Dispatch<YouTubeSpeed>,
  isYTPlaying: boolean,
  setLineNumber: Dispatch<number>,
  setCanUpload: Dispatch<boolean>,
  lineInputReducer: Dispatch<LineInputReducerAction>,
  setAddLyrics: Dispatch<string | null>,
) => {
  const iS_FOCUS_TEXTAREA =
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement;

  if (!iS_FOCUS_TEXTAREA) {
    const player = refs.playerRef!.current as any;

    switch (event.code) {
      case "ArrowUp":
        {
          const selectedLine = refs.tbodyRef.current!.getElementsByClassName("selected-line")[0];

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
          const selectedLine = refs.tbodyRef.current!.getElementsByClassName("selected-line")[0];

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
        refs.editorButtonsRef.current!.add();
        break;

      case "KeyU":
        event.preventDefault();
        refs.editorButtonsRef.current!.update();
        break;

      case "KeyZ":
        if (event.ctrlKey) {
          if (undoredoState.present) {
            const data = undoredoState.present.data as LineEdit;

            dispatch(mapDataUndo(undoredoState.present));
            if (undoredoState.present.type === "add") {
              refs.editorTabRef.current?.undoAddLyrics(data);
              refs.playerRef.current.seekTo(Number(data.time) - 3 * speed);
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
              refs.editorTabRef.current?.redoAddLyrics(data);
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
        refs.editorButtonsRef.current!.delete();
        event.preventDefault();

        break;

      case "KeyQ":
        setAddLyrics(null);
        event.preventDefault();

        break;

      case "KeyF":
        if (event.ctrlKey && event.shiftKey) {
          new WordReplace(mapData, refs.tbodyRef, dispatch, setCanUpload).wordSearchReplace();
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
        console.log("F9");

        new YTSpeedController("down", { setSpeed, playerRef: player });

        event.preventDefault();

        break;

      case "F10":
        new YTSpeedController("up", { setSpeed, playerRef: player });

        event.preventDefault();

        break;
    }
  }
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
