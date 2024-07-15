import { Ticker } from "@pixi/ticker";
import { timer } from "../../(ts)/timer";
import { Line } from "@/types";
import { SceneType, StatusRef, YTStateRef } from "../../(ts)/type";
import { RefsContextType } from "../../(contexts)/refsProvider";
export const ticker = new Ticker();

export let updateFunction;
class YTState {
  play(
    scene: SceneType,
    setScene: React.Dispatch<React.SetStateAction<SceneType>>,
    YTStateRef: React.RefObject<YTStateRef>,
    setNotify: React.Dispatch<React.SetStateAction<string>>,
    playerRef: RefsContextType["playerRef"],
  ) {
    console.log("再生 1");

    if (scene !== "end") {
      setScene("playing");
      updateFunction = () => timer.update(playerRef);
      ticker.add(updateFunction);
      if (!ticker.started) {
        ticker.start();
      }
    }

    const isPaused = YTStateRef.current!.isPaused;

    if (isPaused) {
      YTStateRef.current!.isPaused = false;
      if (!ticker.started) {
        ticker.start();
      }
      setNotify("▶");
    }
  }

  end(setScene: React.Dispatch<React.SetStateAction<SceneType>>) {
    console.log("プレイ終了");
    setScene("end");

    if (ticker.started) {
      ticker.stop();
    }
  }

  stop() {
    console.log("動画停止");
    if (ticker.started) {
      ticker.stop();
    }
  }

  pause(
    YTStateRef: React.RefObject<YTStateRef>,
    setNotify: React.Dispatch<React.SetStateAction<string>>,
  ) {
    console.log("一時停止");

    if (ticker.started) {
      ticker.stop();
    }

    const isPaused = YTStateRef.current!.isPaused;
    if (!isPaused) {
      YTStateRef.current!.isPaused = true;
      setNotify("ll");
    }
  }

  seek(target: any, statusRef: React.RefObject<StatusRef>) {
    const time = target.getCurrentTime();

    if (time === 0) {
      statusRef.current!.status.count = 0;
    }
    console.log("シーク");
  }

  ready(player: any) {
    console.log("ready");

    player.setVolume(30);
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
