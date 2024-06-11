// class WordReplace {

import { Action, Dispatch } from "@reduxjs/toolkit";
import { YTSpeedController } from "../(youtube-content)/ytHandleEvents";
import { RootState } from "../(redux)/store";
import { RefsContextType } from "../(contexts)/refsProvider";
import { mapDataUndoRedo } from "../(redux)/mapDataSlice";
import { undo } from "../(redux)/undoredoSlice";
// 	getKanaSearchLength(searchReg){

// 		let lyricsKana = ""

// 		for(let i=0,len=lineData.value.length; i<len; i++){
// 			lyricsKana += lineData.value[i]['word']
// 		}

// 		const Result = lyricsKana.match(searchReg)

// 		return Result ? Result.length:0;
// 	}

// 	replaceFoundFocus(i, search) {

// 		return new Promise(resolve => {
// 		  setTimeout(() => {
// 			// 指定された行にスクロール
// 			tableScroll(i-2,'instant');

// 			let range = document.createRange();

// 			// 取得した要素の内側を範囲とする
// 			const WORD_NODE = document.getElementsByClassName('line')[i].children[3].firstElementChild;
// 			const textMatch = WORD_NODE.textContent.match(new RegExp(search));

// 			if (textMatch) {
// 			  range.selectNodeContents(WORD_NODE);

// 			  // 範囲を選択状態にする
// 			  range.setStart(WORD_NODE.firstChild, textMatch.index);
// 			  range.setEnd(WORD_NODE.firstChild, textMatch.index + textMatch[0].length);

// 			  // 選択範囲をクリアして新しい範囲を追加
// 			  window.getSelection().removeAllRanges();
// 			  window.getSelection().addRange(range);

// 			  resolve(1);
// 			} else {
// 			  console.error('検索語が見つかりませんでした。');
// 			  resolve(0);
// 			}
// 		  }, 50);
// 		});
// 	  }

// 	replaceDialog(i,searchReg,replace,matchLength){
// 		return new Promise(resolve => {
// 			setTimeout(() => {
// 				if(confirm(`残り${matchLength}件\n${lineData.value[i]['word']}\n置き換えますか？`)){
// 					let n = 0
// 					lineData.value[i]['word'] = lineData.value[i]['word'].replace(searchReg,function(match){ if(++n==1) return replace; else return match; })
// 				}
// 				resolve(1)
// 			}, 50)
// 		})
// 	}

// 	escapeRegExp(string) {
// 		return string ? string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') : null;
// 	}

// }

// class KeyHandler extends WordReplace {

// 	constructor(){
// 		super()
// 	}

// 	undo(){

// 		const LAST = undoSet[undoSet.length-1]

// 		if(LAST.state == 'add'){
// 			lineData.value.splice(LAST.number, 1);
// 			lyricsBox.value = `${LAST.value.lyrics}\n${lyricsBox.value}`
// 			undoSet.pop()
// 			youtube.value.seekTo(LAST.value.time-3)
// 			setLyrics()
// 		}
// 	}

// 	lineSeek(num){
// 		const seekLine = document.getElementsByClassName("line")[NUMBER.value + num]
// 		seekLine.children[1].click()

// 		const scLine = NUMBER.value + (num-3)

// 		tableScroll(scLine, 'smooth')
// 	}

// 	async wordSearchReplace(){

// 		const search = this.escapeRegExp(prompt("置き換えしたい読みを入力してください。"))

// 		if(!search){return;}

// 		let matchLength = this.getKanaSearchLength(new RegExp(search,"g"))
// 		const replace = prompt("置き換えする文字を入力してください。")
// 		const searchReg = new RegExp(`${replace ? `(?!${replace})` : ""}${search}`,"g");

// 		if(search && replace.match(search)){
// 			alert("sorry...置き換えする文字に検索する文字が含まないようにしてください。")
// 			return;
// 		}

// 		for(let i=0,len=lineData.value.length; i<len; i++){

// 			const match = lineData.value[i]['word'].match(searchReg)
// 			if(!match){continue;}
// 			let replacedWord = lineData.value[i]['word']
// 			let replacedLength = 0

// 			for(let j=1;j<match.length+1;j++){
// 				await this.replaceFoundFocus(i,search)
// 				await this.replaceDialog(i,searchReg,replace,matchLength)
// 				replacedWord = replacedWord.replace(search,"")
// 				replacedLength += search.length
// 				matchLength--
// 			}

// 		}

// 	}
// }
//KeyHandler

export const handleKeydown = (
  event: KeyboardEvent,
  refs: RefsContextType,
  dispatch: Dispatch<Action>,
  ytState: RootState["ytState"],
  undoredoState: RootState["undoRedo"]
) => {
  const iS_FOCUS_TEXTAREA =
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement;

  if (!iS_FOCUS_TEXTAREA) {
    const player = refs.playerRef!.current as any;

    switch (event.code) {
      case "ArrowUp":
        event.preventDefault();

        break;

      case "ArrowDown":
        event.preventDefault();

        break;

      case "ArrowLeft":
        {
          const time = player.getCurrentTime();

          player.seekTo(time - 3 * ytState.speed);

          event.preventDefault();
        }

        break;

      case "ArrowRight":
        {
          const time = player.getCurrentTime();

          player.seekTo(time + 3 * ytState.speed);

          event.preventDefault();
        }

        break;

      case "KeyS":
        refs.editorTabRef.current!.add();
        break;

      case "KeyU":
        event.preventDefault();
        refs.editorTabRef.current!.update();
        break;

      case "KeyZ":
        if (event.ctrlKey) {
          if (undoredoState.present) {
            dispatch(mapDataUndoRedo(undoredoState.present));
            refs.editorTabRef.current?.undoAdd(undoredoState.present.data!);
            dispatch(undo());
            event.preventDefault();
          }
        }

        break;

      case "KeyY":
        if (event.ctrlKey) {
          event.preventDefault();
        }

        break;

      case "KeyD":
        event.preventDefault();

        break;

      case "Delete":
        refs.editorTabRef.current!.delete();
        event.preventDefault();

        break;

      case "KeyQ":
        event.preventDefault();

        break;

      case "KeyF":
        break;

      case "Escape":
        if (!ytState.isPlaying) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }

        event.preventDefault();

        break;

      case "F9":
        console.log("F9");

        new YTSpeedController("down", { dispatch, playerRef: player });

        event.preventDefault();

        break;

      case "F10":
        new YTSpeedController("up", { dispatch, playerRef: player });

        event.preventDefault();

        break;
    }
  }
};
