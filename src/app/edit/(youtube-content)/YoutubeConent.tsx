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
  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || ""; // デフォルト値を設定
  const handleReady = useCallback(
    (event) => {
      const player = event.target;
      setPlayerRef(player); // setPlayerRefを使用して更新
      ytState.ready(playerRef, setValue);
    },
    [playerRef, setPlayerRef, setValue]
  );

  const handlePlay = useCallback(() => {
    ytState.play(playerRef, dispatch);
  }, [dispatch, playerRef]);

  const handlePause = useCallback(() => {
    ytState.pause(dispatch);
  }, [dispatch]);

  const handleEnd = useCallback(() => {
    ytState.end(dispatch);
  }, [dispatch]);

  const handleStateChange = useCallback(
    (event) => {
      if (event.data === 3) {
        ytState.seek(playerRef, dispatch, mapData);
      }
    },
    [dispatch, mapData, playerRef]
  );

  return (
    <YouTube
      className={className}
      videoId={videoId}
      opts={{
        width: "384px",
        height: "216px",
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
