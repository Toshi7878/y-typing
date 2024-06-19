import { Ticker } from "@pixi/ticker";
import { timer } from "./timer";
import { Action, Dispatch } from "@reduxjs/toolkit";
import { RefsContextType } from "../../(contexts)/refsProvider";
import { Line } from "@/types";
const ticker = new Ticker();

class YTState {
  play(playerRef: RefsContextType["playerRef"]) {
    console.log("再生 1");

    ticker.add(() => timer.update(playerRef));
    ticker.start();
  }

  end() {
    console.log("プレイ終了");
    ticker.stop();
  }

  stop() {
    console.log("動画停止");
  }

  pause() {
    console.log("一時停止");

    ticker.stop();
  }

  seek() {
    console.log("シーク");
  }

  ready(refs: RefsContextType) {
    console.log("ready");

    refs.playerRef.current.setVolume(30);
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
