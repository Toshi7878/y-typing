"use client";
import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { ytState } from "./youtubeEvents";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "./playerProvider";
import { useFormContext } from "react-hook-form";
import { RootState } from "../(redux)/store";
import { useSearchParams } from "next/navigation";

const YouTubeContent = function YouTubeContent({ className }: { className: string }) {
  console.log("YouTube");
  const { setValue } = useFormContext();
  const { playerRef, setPlayerRef } = usePlayer();
  const dispatch = useDispatch();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);

  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || ""; // デフォルト値を設定

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      setPlayerRef(player); // setPlayerRefを使用して更新
      ytState.ready(playerRef, setValue, dispatch);
    },
    [dispatch, playerRef, setPlayerRef, setValue]
  );

  const handlePlay = useCallback(() => {
    ytState.play(playerRef, dispatch, isStarted);
  }, [dispatch, isStarted, playerRef]);

  const handlePause = useCallback(() => {
    ytState.pause(dispatch);
  }, [dispatch]);

  const handleEnd = useCallback(() => {
    ytState.end(dispatch);
  }, [dispatch]);

  const handleStateChange = useCallback(
    (event) => {
      if (event.data === 3) {
        // seek時の処理
        ytState.seek(playerRef, dispatch, mapData);
      } else if (event.data === 1) {
        //	未スタート、他の動画に切り替えた時など
        if (!isStarted) {
          playerRef.current.seekTo(0);
        }
        console.log("未スタート -1");
      }
    },
    [dispatch, isStarted, mapData, playerRef]
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
        playerVars: { showinfo: 1, enablejsapi: 1 },
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
