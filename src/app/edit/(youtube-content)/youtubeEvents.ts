import { Dispatch, RefObject } from "react";
import { Ticker } from "@pixi/ticker";
import { timer } from "./timer";
import { setIsPlaying, setIsStarted } from "../(redux)/playingSlice";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { setTimeIndex } from "../(redux)/lineIndexSlice";
import { setYtTitle } from "../(redux)/ytTitleSlice";

const ticker = new Ticker();

class YTState {
  state: string;

  constructor() {
    this.state = "ready";
  }

  play(playerRef: RefObject<any>, dispatch: Dispatch<any>, isStarted: boolean) {
    console.log("再生 1");

    if (!isStarted) {
      ticker.add(() => timer.update(playerRef));
    }
    ticker.start();
    dispatch(setIsPlaying(true));
    dispatch(setIsStarted(true));

    dispatch(setTabIndex(1));
  }

  end(dispatch: Dispatch<any>) {
    console.log("プレイ終了");
    ticker.stop();
    dispatch(setIsPlaying(false));
  }

  stop(dispatch: Dispatch<any>) {
    console.log("動画停止");
    dispatch(setIsPlaying(false));
  }

  pause(dispatch: Dispatch<any>) {
    console.log("一時停止");

    ticker.stop();
    dispatch(setIsPlaying(false));
  }

  seek(playerRef: RefObject<any>, dispatch: Dispatch<any>, mapData: any) {
    console.log("シーク");

    const time: number = playerRef?.current?.getCurrentTime()!;
    dispatch(setTimeIndex(seekTimeIndex(time, mapData)));
  }

  async ready(playerRef: RefObject<any>, setValue: UseFormSetValue<FieldValues>, dispatch: Dispatch<any>) {
    console.log("ready");
    const videoData = playerRef.current.getVideoData();

    if (videoData) {
      const { title, video_id } = videoData;
      const url = `https://www.youtube.com/watch?v=${video_id}`;
      dispatch(setYtTitle(title));
      setValue("title", title);
      setValue("url", url);
    }
    playerRef.current.setVolume(10);
  }
}

function seekTimeIndex(time: number, mapData: any) {
  let count = 0;

  for (let i = 0; i < mapData.length; i++) {
    if (mapData[i]["time"] - time >= 0) {
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
