import { Dispatch, RefObject } from "react";
import ReactPlayer from "react-player";
import { Ticker } from "@pixi/ticker";
import { timer } from "./timer";
import { startPlaying, stopPlaying } from "../(redux)/playingSlice";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import { FieldValues, UseFormSetValue } from "react-hook-form";

const ticker = new Ticker();

class YTState {
  state: string;

  constructor() {
    this.state = "ready";
  }

  play(playerRef: RefObject<ReactPlayer>, dispatch: Dispatch<any>, setValue: UseFormSetValue<any>) {
    console.log("再生 1");

    if (this.state === "ready") {
      ticker.add(() => timer.update(playerRef, setValue));
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

  async ready(playerRef: RefObject<ReactPlayer>, setValue: UseFormSetValue<FieldValues>) {
    console.log("ready");
    const videoData = playerRef?.current?.getInternalPlayer()?.getVideoData();
    if (videoData) {
      const { title, video_id } = videoData;
      const url = `https://www.youtube.com/watch?v=${video_id}`;
      setValue("InfoTab.title", title);
      setValue("InfoTab.url", url);
    }
    //youtube.value.setVolume(volume.value);
  }

  updateDuration() {
    // const DURATION = youtube.value.getDuration();
    // document.getElementById("time-bar").max = DURATION;
    // lineData.value[lineData.value.length - 1].time = DURATION.toFixed(3);
  }
}

export const ytState = new YTState();
