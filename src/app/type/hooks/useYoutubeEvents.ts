import { Ticker } from "@pixi/ticker";
import {
  useSceneAtom,
  useSetPlayingNotifyAtom,
  useSetSceneAtom,
} from "../type-atoms/gameRenderAtoms";
import { useRefs } from "../type-contexts/refsProvider";
import { useUpdateLine } from "./playing-hooks/timer-hooks/useTimer";
import NProgress from "nprogress";
import { useGetSeekLineCount } from "./playing-hooks/timer-hooks/useSeekGetLineCount";

export const typeTicker = new Ticker();

export const useYTPlayEvent = () => {
  const { ytStateRef, playerRef, gameStateRef } = useRefs();
  const scene = useSceneAtom();
  const setScene = useSetSceneAtom();
  const setNotify = useSetPlayingNotifyAtom();
  return () => {
    console.log("再生 1");

    if (scene === "ready") {
      if (ytStateRef.current) {
        ytStateRef.current.movieDuration = playerRef.current.getDuration();
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
      if (!typeTicker.started) {
        typeTicker.start();
      }

      gameStateRef.current!.isSeekedLine = false;
    }
    const isPaused = ytStateRef.current!.isPaused;

    if (isPaused) {
      ytStateRef.current!.isPaused = false;
      setNotify(Symbol("▶"));
    }
  };
};

export const useYTEndEvent = () => {
  const { playerRef } = useRefs();

  return () => {
    console.log("プレイ終了");

    playerRef.current.seekTo(0);
    playerRef.current.stopVideo();
  };
};

export const useYTStopEvent = () => {
  const setScene = useSetSceneAtom();
  return () => {
    console.log("動画停止");

    setScene("end");

    if (typeTicker.started) {
      typeTicker.stop();
    }
  };
};

export const useYTPauseEvent = () => {
  const { ytStateRef } = useRefs();
  const setNotify = useSetPlayingNotifyAtom();

  return () => {
    console.log("一時停止");

    if (typeTicker.started) {
      typeTicker.stop();
    }

    const isPaused = ytStateRef.current!.isPaused;
    if (!isPaused) {
      ytStateRef.current!.isPaused = true;
      setNotify(Symbol("ll"));
    }
  };
};

export const useYTSeekEvent = () => {
  const { gameStateRef, statusRef, playerRef } = useRefs();
  const scene = useSceneAtom();
  const updateLine = useUpdateLine();
  const getSeekLineCount = useGetSeekLineCount();

  return () => {
    const time = playerRef.current.getCurrentTime();

    if (scene === "replay" || scene === "practice") {
      const isSeekedLine = gameStateRef.current!.isSeekedLine;

      if (isSeekedLine) {
        gameStateRef.current!.isSeekedLine = false;
        const newCount = getSeekLineCount(time);
        console.log(newCount);
        statusRef.current!.status.count = newCount;
        updateLine(newCount);
        if (typeTicker.started) {
          typeTicker.stop();
        }
      }
    }

    const isRetrySkip = gameStateRef.current!.isRetrySkip;

    if (isRetrySkip && time === 0) {
      statusRef.current!.status.count = 0;
    }
    console.log("シーク");
  };
};

export const useYTReadyEvent = () => {
  const { setRef } = useRefs();

  return (event: { target: any }) => {
    const player = event.target;
    NProgress.done();
    setRef("playerRef", player);
    console.log("ready");
    player.setVolume(30);
  };
};
