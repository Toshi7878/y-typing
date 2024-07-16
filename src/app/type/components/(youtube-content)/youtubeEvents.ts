import { Line } from "@/types";
import { SceneType, StatusRef, YTStateRef } from "../../(ts)/type";
import { ticker } from "../(typing-area)/scene/Playing";

class YTState {
  play(
    scene: SceneType,
    setScene: React.Dispatch<React.SetStateAction<SceneType>>,
    YTStateRef: React.RefObject<YTStateRef>,
    setNotify: React.Dispatch<React.SetStateAction<string>>,
  ) {
    console.log("再生 1");

    if (scene === "ready") {
      setScene("playing");
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

  seek(target: any, statusRef: React.RefObject<StatusRef>, isRetrySkip: boolean) {
    const time = target.getCurrentTime();

    if (isRetrySkip && time === 0) {
      statusRef.current!.status.count = 0;
      if (!ticker.started) {
        ticker.start();
      }
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
