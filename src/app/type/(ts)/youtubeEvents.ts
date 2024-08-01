import { GameStateRef, MapData, SceneType, StatusRef, YTStateRef } from "./type";
import { ticker } from "../components/(typing-area)/scene/Playing";
import { CreateMap } from "./createTypingWord";

class YTState {
  play(
    scene: SceneType,
    setScene: React.Dispatch<React.SetStateAction<SceneType>>,
    YTStateRef: React.RefObject<YTStateRef>,
    setNotify: React.Dispatch<React.SetStateAction<string>>,
    playerRef: React.RefObject<any>,
    gameStateRef: React.RefObject<GameStateRef>,
  ) {
    console.log("再生 1");

    if (scene === "ready") {
      if (YTStateRef.current) {
        YTStateRef.current.movieEndTime = playerRef.current.getDuration();
      }

      if (gameStateRef.current!.replay.replayData.length > 0) {
        setScene("replay");
      } else if (gameStateRef.current!.practice.isPracticeMode) {
        setScene("practice");
      } else {
        setScene("playing");
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

  end(setScene: React.Dispatch<React.SetStateAction<SceneType>>, playerRef: React.RefObject<any>) {
    console.log("プレイ終了");
    // setScene("end");

    // if (ticker.started) {
    //   ticker.stop();
    // }

    playerRef.current.seekTo(0);
    playerRef.current.stopVideo();
  }

  stop(setScene: React.Dispatch<React.SetStateAction<SceneType>>) {
    console.log("動画停止");

    setScene("end");

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

  seek(
    target: any,
    statusRef: React.RefObject<StatusRef>,
    isRetrySkip: boolean,
    map: CreateMap,
    scene: SceneType,
  ) {
    const time = target.getCurrentTime();

    if (scene === "replay" || scene === "practice") {
      const newCount = seekTimeIndex(time, map.mapData);
      console.log(newCount);
      statusRef.current!.status.count = newCount;
    }

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

function seekTimeIndex(time: number, mapData: MapData) {
  let count = 0;

  for (let i = 0; i < mapData.length; i++) {
    if (Number(mapData[i]["time"]) > time) {
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
