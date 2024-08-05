"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { ytState } from "../../(ts)/youtubeEvents";
import { useRefs } from "../../(contexts)/refsProvider"; // 変更
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { mapAtom, playingNotifyAtom, sceneAtom } from "../../(atoms)/gameRenderAtoms";

interface YouTubeProps {
  className: string;
  videoId: string;
}

const YouTubeContent = function YouTubeContent({ className, videoId }: YouTubeProps) {
  console.log("YouTube");
  const [scene, setScene] = useAtom(sceneAtom);
  const setNotify = useSetAtom(playingNotifyAtom);
  const refs = useRefs();
  const map = useAtomValue(mapAtom);

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      refs.setRef("playerRef", player);
      ytState.ready(player);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handlePlay = useCallback(() => {
    ytState.play(scene, setScene, refs.ytStateRef, setNotify, refs.playerRef, refs.gameStateRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const handlePause = useCallback(() => {
    ytState.pause(refs.ytStateRef, setNotify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = useCallback(() => {
    ytState.end(refs.playerRef);
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
        ytState.seek(event.target, refs.statusRef, refs.gameStateRef, map!, scene);
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
    [scene, map],
  );

  return (
    <YouTube
      className={className}
      videoId={videoId}
      opts={{
        width: "100%",
        height: "100%",
        playerVars: { enablejsapi: 1 },
      }}
      onReady={handleReady}
      onPlay={handlePlay}
      onPause={handlePause}
      onEnd={handleEnd}
      onStateChange={handleStateChange}
    />
  );
};

export default YouTubeContent;
