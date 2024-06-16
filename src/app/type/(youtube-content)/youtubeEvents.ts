import { Ticker } from "@pixi/ticker";
import { timer } from "./timer";
import { setIsPlaying, setIsReady, setIsStarted } from "../(redux)/ytStateSlice";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { setTimeIndex } from "../(redux)/lineIndexSlice";
import { setYtTitle } from "../(redux)/tabInfoInputSlice";
import { Action, Dispatch } from "@reduxjs/toolkit";
import { RefsContextType } from "../(contexts)/refsProvider";
import { Line } from "../(tab-content)/(ts)/buttonEvent";
const ticker = new Ticker();

class YTState {
  play(playerRef: RefsContextType["playerRef"], dispatch: Dispatch<Action>, isStarted: boolean) {
    console.log("再生 1");

    if (!isStarted) {
      ticker.add(() => timer.update(playerRef));
    }
    ticker.start();
    dispatch(setIsPlaying(true));
    dispatch(setIsStarted(true));
    dispatch(setTabIndex(1));
  }

  end(dispatch: Dispatch<Action>) {
    console.log("プレイ終了");
    ticker.stop();
    dispatch(setIsPlaying(false));
  }

  stop(dispatch: Dispatch<Action>) {
    console.log("動画停止");
    dispatch(setIsPlaying(false));
  }

  pause(dispatch: Dispatch<Action>) {
    console.log("一時停止");

    ticker.stop();
    dispatch(setIsPlaying(false));
  }

  seek(event: any, dispatch: Dispatch<Action>, mapData: Line[]) {
    console.log("シーク");

    const time = event.target.getCurrentTime()!;
    dispatch(setTimeIndex(seekTimeIndex(time, mapData)));
  }

  ready(refs: RefsContextType, dispatch: Dispatch<Action>, title: string) {
    console.log("ready");
    const videoData = refs.playerRef!.current!.getVideoData();

    dispatch(setIsReady(true));

    if (videoData && !title) {
      const { title } = videoData;
      dispatch(setYtTitle(title));
    }
    refs.playerRef.current.setVolume(refs.editorTabRef.current?.getVolume());
  }
}

function seekTimeIndex(time: number, mapData: Line[]) {
  let count = 0;

  for (let i = 0; i < mapData.length; i++) {
    if (Number(mapData[i]["time"]) - time >= 0) {
      count = i - 1;
      break;
    }
  }

  if (count < 0) {
    count = 0;
  }

  return count;
}

export const ytState = new YTState();
