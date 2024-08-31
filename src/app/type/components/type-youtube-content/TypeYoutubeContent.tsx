"use client";

import React, { useCallback, useMemo } from "react";
import YouTube from "react-youtube";
import { ytState } from "../../ts/youtubeEvents";
import { useRefs } from "../../type-contexts/refsProvider"; // 変更
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  inputModeAtom,
  lineResultsAtom,
  mapAtom,
  playingNotifyAtom,
  sceneAtom,
  speedAtom,
} from "../../type-atoms/gameRenderAtoms";

interface TypeYouTubeProps {
  className: string;
  videoId: string;
}

const TypeYouTubeContent = function YouTubeContent({ className, videoId }: TypeYouTubeProps) {
  console.log("YouTube");
  const [scene, setScene] = useAtom(sceneAtom);
  const setNotify = useSetAtom(playingNotifyAtom);
  const {
    ytStateRef,
    playerRef,
    statusRef,
    gameStateRef,
    playingRef,
    lineProgressRef,
    playingCenterRef,
    playingLineTimeRef,
    setRef,
  } = useRefs();
  const map = useAtomValue(mapAtom);
  const inputMode = useAtomValue(inputModeAtom);
  const speedData = useAtomValue(speedAtom);
  const lineResults = useAtomValue(lineResultsAtom);

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      setRef("playerRef", player);
      ytState.ready(player);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handlePlay = useCallback(() => {
    ytState.play(scene, setScene, ytStateRef, setNotify, playerRef, gameStateRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const handlePause = useCallback(() => {
    ytState.pause(ytStateRef, setNotify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = useCallback(() => {
    ytState.end(playerRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateChange = useCallback(
    (event: any) => {
      if (
        document.activeElement instanceof HTMLIFrameElement &&
        document.activeElement.tagName === "IFRAME"
      ) {
        document.activeElement.blur();
      }

      if (event.data === 3) {
        // seek時の処理
        ytState.seek(
          event.target,
          statusRef,
          gameStateRef,
          map!,
          scene,
          inputMode,
          speedData,
          playingRef,
          playingCenterRef,
          playingLineTimeRef,
          lineProgressRef,
          lineResults,
          ytStateRef,
        );
      } else if (event.data === 1) {
        //	未スタート、他の動画に切り替えた時など
        console.log("未スタート -1");

        if (scene === "ready") {
          event.target.seekTo(0);
        }
      } else if (event.data === 5) {
        console.log("動画強制停止");
        ytState.stop(setScene);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, map, inputMode, speedData, lineResults],
  );

  const memoizedYouTube = useMemo(
    () => (
      <YouTube
        className={className}
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            enablejsapi: 1,
            controls: 0,
          },
        }}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnd={handleEnd}
        onStateChange={handleStateChange}
      />
    ),
    [className, videoId, handleReady, handlePlay, handlePause, handleEnd, handleStateChange],
  );

  return memoizedYouTube;
};

export default TypeYouTubeContent;
