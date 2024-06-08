import { Dispatch, RefObject } from "react";
import { Ticker } from "@pixi/ticker";
import { timer } from "./timer";
import { startPlaying, stopPlaying } from "../(redux)/playingSlice";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { setTimeIndex } from "../(redux)/lineIndexSlice";

const ticker = new Ticker();

class YTState {
  state: string;

  constructor() {
    this.state = "ready";
  }

  play(playerRef: RefObject<any>, dispatch: Dispatch<any>) {
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
    console.log("プレイ終了");
    this.state = "end";
    ticker.stop();
    dispatch(stopPlaying());
  }

  stop(dispatch: Dispatch<any>) {
    console.log("動画停止");
    this.state = "end";
    dispatch(stopPlaying());
  }

  pause(dispatch: Dispatch<any>) {
    console.log("一時停止");

    ticker.stop();
    this.state = "pause";
    dispatch(stopPlaying());
  }

  seek(playerRef: RefObject<any>, dispatch: Dispatch<any>, mapData: any) {
    console.log("シーク");

    const time: number = playerRef?.current?.getCurrentTime()!;
    dispatch(setTimeIndex(seekTimeIndex(time, mapData)));
  }

  async ready(playerRef: RefObject<any>, setValue: UseFormSetValue<FieldValues>) {
    console.log("ready");
    const videoData = playerRef.current.getVideoData();

    if (videoData) {
      const { title, video_id } = videoData;
      const url = `https://www.youtube.com/watch?v=${video_id}`;
      setValue("InfoTab.title", title);
      setValue("InfoTab.url", url);
    }
    playerRef.current.setVolume(10);
  }
}

function seekTimeIndex(time: number, mapData: any) {
  let count = 0;

  for (let i = 0; i < mapData.length; i++) {
    if (time - mapData[i]["time"] >= 0) {
      count = i;
      break;
    }
  }

  if (count < 0) {
    count = 0;
  }

  return count;
}

export const ytState = new YTState();