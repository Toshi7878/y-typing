"use client";
import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { ytState } from "./youtubeEvents";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { RootState } from "../(redux)/store";
import { useSearchParams } from "next/navigation";
import { useRefs } from "../(contexts)/refsProvider"; // 変更

const YouTubeContent = function YouTubeContent({ className }: { className: string }) {
  console.log("YouTube");
  const { setValue } = useFormContext();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || "";

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const playerState = useSelector((state: RootState) => state.ytState);
  const refs = useRefs();

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      refs.setRef("playerRef", player);
      ytState.ready(refs.playerRef, setValue, dispatch);
    },
    [refs, setValue, dispatch]
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
    [dispatch, mapData, playerState.isStarted]
  );

  const HEIGHT = "384px";
  const WEDTH = "216px";

  return (
    <YouTube
      style={{ minWidth: HEIGHT, minHeight: WEDTH }}
      className={className}
      videoId={videoId}
      opts={{
        width: HEIGHT,
        height: WEDTH,
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
