import { timer } from "./editTimer";
import { setIsPlaying, setIsReady, setIsStarted } from "../../redux/ytStateSlice";
import { setTimeIndex } from "../../redux/lineIndexSlice";
import { setYtTitle } from "../../redux/tabInfoInputSlice";
import { Action } from "@reduxjs/toolkit";
import { RefsContextType } from "../../edit-contexts/refsProvider";
import { Line } from "@/types";
import { Ticker } from "@pixi/ticker";
import { EditTabIndex } from "../type";
import { Dispatch } from "react";
export const editTicker = new Ticker();
class YTState {
  play(
    playerRef: RefsContextType["playerRef"],
    dispatch: Dispatch<Action>,
    setTabIndex: Dispatch<EditTabIndex>,
    isStarted: boolean,
  ) {
    console.log("再生 1");

    if (!isStarted) {
      editTicker.add(() => timer.update(playerRef));
    }
    editTicker.start();
    dispatch(setIsPlaying(true));
    dispatch(setIsStarted(true));
    setTabIndex(1);
  }

  end(dispatch: Dispatch<Action>) {
    console.log("プレイ終了");
    editTicker.stop();
    dispatch(setIsPlaying(false));
  }

  stop(dispatch: Dispatch<Action>) {
    console.log("動画停止");
    dispatch(setIsPlaying(false));
  }

  pause(dispatch: Dispatch<Action>) {
    console.log("一時停止");

    editTicker.stop();
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
