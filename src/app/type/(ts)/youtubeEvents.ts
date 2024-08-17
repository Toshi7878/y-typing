import {
  GameStateRef,
  InputModeType,
  LineData,
  LineResultData,
  MapData,
  PlayingRef,
  SceneType,
  Speed,
  StatusRef,
  YTStateRef,
} from "./type";
import { ticker } from "../components/(typing-area)/scene/Playing";
import { CreateMap } from "./scene-ts/ready/createTypingWord";
import { setNewLine } from "./scene-ts/playing/timer";
import { PlayingLineTimeRef } from "../components/(typing-area)/scene/playing-child/child/PlayingLineTime";
import { PlayingCenterRef } from "../components/(typing-area)/scene/playing-child/PlayingCenter";

class YTState {
  play(
    scene: SceneType,
    setScene: React.Dispatch<React.SetStateAction<SceneType>>,
    YTStateRef: React.RefObject<YTStateRef>,
    setNotify: React.Dispatch<React.SetStateAction<symbol>>,
    playerRef: React.RefObject<any>,
    gameStateRef: React.RefObject<GameStateRef>,
  ) {
    console.log("再生 1");

    if (scene === "ready") {
      if (YTStateRef.current) {
        YTStateRef.current.movieEndTime = playerRef.current.getDuration();
      }

      const playMode = gameStateRef.current!.playMode;

      if (playMode === "replay") {
        setScene("replay");
      } else if (playMode === "practice") {
        setScene("practice");
      } else {
        setScene("playing");
      }
    }

    if (scene === "playing" || scene === "replay" || scene === "practice") {
      if (!ticker.started) {
        ticker.start();
      }

      gameStateRef.current!.isSeekedLine = false;
    }
    const isPaused = YTStateRef.current!.isPaused;

    if (isPaused) {
      YTStateRef.current!.isPaused = false;

      setNotify(Symbol("▶"));
    }
  }

  end(playerRef: React.RefObject<any>) {
    console.log("プレイ終了");

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
    setNotify: React.Dispatch<React.SetStateAction<symbol>>,
  ) {
    console.log("一時停止");

    if (ticker.started) {
      ticker.stop();
    }

    const isPaused = YTStateRef.current!.isPaused;
    if (!isPaused) {
      YTStateRef.current!.isPaused = true;
      setNotify(Symbol("ll"));
    }
  }

  seek(
    target: any,
    statusRef: React.RefObject<StatusRef>,
    gameStateRef: React.RefObject<GameStateRef>,
    map: CreateMap,
    scene: SceneType,
    inputMode: InputModeType,
    speedData: Speed,
    playingRef: React.RefObject<PlayingRef>,
    playingCenterRef: React.RefObject<PlayingCenterRef>,
    playingLineTimeRef: React.RefObject<PlayingLineTimeRef>,
    lineProgressRef: React.RefObject<HTMLProgressElement>, // 修正箇所
    lineResults: LineResultData[],
  ) {
    const time = target.getCurrentTime();

    if (scene === "replay" || scene === "practice") {
      const isSeekedLine = gameStateRef.current!.isSeekedLine;

      if (isSeekedLine) {
        gameStateRef.current!.isSeekedLine = false;
        const newCount = getLineCount(time, map.mapData);
        console.log(newCount);
        statusRef.current!.status.count = newCount;
        setNewLine(
          newCount,
          scene,
          statusRef,
          map,
          inputMode,
          speedData,
          playingLineTimeRef,
          playingCenterRef,
          lineProgressRef,
          lineResults,
          gameStateRef,
          playingRef,
        );
        if (ticker.started) {
          ticker.stop();
        }
      }
    }

    const isRetrySkip = gameStateRef.current!.isRetrySkip;

    if (isRetrySkip && time === 0) {
      statusRef.current!.status.count = 0;
    }
    console.log("シーク");
  }

  ready(player: any) {
    console.log("ready");

    player.setVolume(30);
  }
}

export function getLineCount(time: number, mapData: LineData[]): number {
  const index = mapData.findIndex((line) => line.time >= time);
  return Math.max(index);
}

export const ytState = new YTState();
