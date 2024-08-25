import { timer } from "./editTimer";
import { RefsContextType } from "../../edit-contexts/refsProvider";
import { Line } from "@/types";
import { Ticker } from "@pixi/ticker";
import { EditTabIndex } from "../type";
import { Dispatch } from "react";
export const editTicker = new Ticker();
class YTState {
  play(
    playerRef: RefsContextType["playerRef"],
    setIsYTPlaying: Dispatch<boolean>,
    setTabIndex: Dispatch<EditTabIndex>,
    setIsYTStarted: Dispatch<boolean>,
  ) {
    console.log("再生 1");

    editTicker.add(() => timer.update(playerRef));
    editTicker.start();
    setIsYTPlaying(true);
    setIsYTStarted(true);
    setTabIndex(1);
  }

  end(setIsYTPlaying: Dispatch<boolean>) {
    console.log("プレイ終了");
    editTicker.stop();
    setIsYTPlaying(false);
  }

  stop(setIsYTPlaying: Dispatch<boolean>) {
    console.log("動画停止");
    setIsYTPlaying(false);
  }

  pause(setIsYTPlaying: Dispatch<boolean>) {
    console.log("一時停止");

    editTicker.stop();
    setIsYTPlaying(false);
  }

  seek(event: any, setTimeCount: Dispatch<number>, mapData: Line[]) {
    console.log("シーク");

    const time = event.target.getCurrentTime()!;
    setTimeCount(getCount(time, mapData));
  }

  ready(
    refs: RefsContextType,
    setMapTitle: Dispatch<string>,
    setIsReady: Dispatch<boolean>,
    title: string,
  ) {
    console.log("ready");
    const videoData = refs.playerRef!.current!.getVideoData();
    setIsReady(true);
    if (videoData && !title) {
      const { title } = videoData;
      setMapTitle(title);
    }
    refs.playerRef.current.setVolume(refs.editorTabRef.current?.getVolume());
  }
}

function getCount(time: number, mapData: Line[]) {
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
