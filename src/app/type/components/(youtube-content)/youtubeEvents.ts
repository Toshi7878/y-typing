import { Ticker } from "@pixi/ticker";
import { timer } from "../../(ts)/timer";
import { RefsContextType } from "../../(contexts)/refsProvider";
import { Line } from "@/types";
export const ticker = new Ticker();

export let updateFunction;
class YTState {
  play(setScene: React.Dispatch<React.SetStateAction<"ready" | "playing" | "end">>) {
    console.log("再生 1");
    setScene("playing");
    ticker.start();
  }

  end(setScene: React.Dispatch<React.SetStateAction<"ready" | "playing" | "end">>) {
    console.log("プレイ終了");
    setScene("end");

    ticker.stop();
  }

  stop() {
    console.log("動画停止");
    ticker.stop();
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
    updateFunction = () => timer.update(refs.playerRef);

    ticker.add(updateFunction);
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
