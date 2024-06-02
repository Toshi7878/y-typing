import { Dispatch, RefObject, SetStateAction } from "react";
import ReactPlayer from "react-player";
import { Ticker } from "@pixi/ticker";
import { timer } from "./timer";
import { startPlaying, stopPlaying } from "../(redux)/playingSlice";
import { setTabIndex } from "../(redux)/tabIndexSlice";

const ticker = new Ticker();

class YTState {
  state: string;

  constructor() {
    this.state = "ready";
  }

  play(playerRef: RefObject<ReactPlayer>, dispatch: Dispatch<any>) {
    console.log("再生 1");

    if (this.state === "ready") {
      ticker.add(() => timer.update(playerRef));
    }
    ticker.start();
    this.state = "play";
    dispatch(startPlaying());
    dispatch(setTabIndex(1));

    // if (ytState.state == "ready") {
    //   //ready時の動画時間取得処理は整数秒のみでしか取得できないので再生時にもういちど取得
    //   ytState.updateDuration();
    // }
    // ticker.start();
    // ytState.state = YTState.LIST[event.data];
    // line.updateBackgroundColor(line.count - 1);
  }

  end(dispatch: Dispatch<any>) {
    console.log("プレイ終了 0");
    this.state = "end";
    // ytState.state = YTState.LIST[event.data];
    ticker.stop();
    dispatch(stopPlaying());
  }

  stop(dispatch: Dispatch<any>) {
    console.log("動画停止 5");
    this.state = "end";
    dispatch(stopPlaying());
  }

  pause(dispatch: Dispatch<any>) {
    console.log("一時停止 2");

    // ytState.state = YTState.LIST[event.data];
    ticker.stop();
    this.state = "pause";
    dispatch(stopPlaying());
  }

  seek() {
    console.log("シーク 3");

    // line.getLineCount(event.target.getCurrentTime());
    // line.blurBackgroundColor();
  }

  async ready() {
    console.log("ready");
    // document.getElementById("time-bar").value = 0;
    // URL.value = `https://www.youtube.com/watch?v=${youtube.value.src}`;
    // if (!TITLE.value) {
    //   TITLE.value = youtube.value.player.g.title;
    // }
    // if (!lineData.value.length) {
    //   lineData.value.splice(
    //     0,
    //     2,
    //     { time: "0", lyrics: "", word: "" },
    //     { time: Infinity, lyrics: "end", word: "" }
    //   );
    // }
    // this.updateDuration();
    // LineBlur.selectBlur();
    // youtube.value.setVolume(volume.value);
  }

  updateDuration() {
    // const DURATION = youtube.value.getDuration();
    // document.getElementById("time-bar").max = DURATION;
    // lineData.value[lineData.value.length - 1].time = DURATION.toFixed(3);
  }
}

export const ytState = new YTState();
