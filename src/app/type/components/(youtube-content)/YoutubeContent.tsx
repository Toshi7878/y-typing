"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { ytState } from "./youtubeEvents";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../(redux)/store";
import { useRefs } from "../../(contexts)/refsProvider"; // 変更
import { Box } from "@chakra-ui/react";

interface YouTubeProps {
  className: string;
  videoId: string;
}

const YouTubeContent = function YouTubeContent({ className, videoId }: YouTubeProps) {
  console.log("YouTube");
  const dispatch = useDispatch();

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const playerState = useSelector((state: RootState) => state.ytState);
  const refs = useRefs();

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      refs.setRef("playerRef", player);
      ytState.ready(refs, dispatch);
    },
    [refs, dispatch],
  );

  const handlePlay = useCallback(() => {
    ytState.play(refs.playerRef, dispatch, playerState.isStarted);
  }, [dispatch, refs.playerRef, playerState.isStarted]);

  const handlePause = useCallback(() => {
    ytState.pause(dispatch);
  }, [dispatch]);

  const handleEnd = useCallback(() => {
    ytState.end(dispatch);
  }, [dispatch]);

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
        ytState.seek(event, dispatch, mapData);
      } else if (event.data === 1) {
        //	未スタート、他の動画に切り替えた時など
        if (!playerState.isStarted) {
          event.target.seekTo(0);
        }
        console.log("未スタート -1");
      }
    },
    [dispatch, mapData, playerState.isStarted],
  );

  const HEIGHT = (288).toFixed();
  const WIDTH = ((Number(HEIGHT) * 16) / 9).toFixed();
  return (
    <Box style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
      <YouTube
        className={`${className}`}
        videoId={videoId}
        opts={{
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          playerVars: { enablejsapi: 1 },
        }}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnd={handleEnd}
        onStateChange={handleStateChange}
      />
    </Box>
  );
};

export default YouTubeContent;
