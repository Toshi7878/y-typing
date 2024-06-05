// ts
"use client";
import React from "react";
import ReactPlayer from "react-player/lazy";
import { ytState } from "./youtubeEvents";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "./playerProvider";
import { useFormContext } from "react-hook-form";
// export const runtime = "edge";

const YouTubeContent = React.memo(function YouTubeContent({ className }: { className: string }) {
  console.log("YouTube");
  const { register, setValue } = useFormContext();

  const { playerRef } = usePlayer();
  const dispatch = useDispatch();
  const playing: boolean = useSelector(
    (state: { playing: { value: boolean } }) => state.playing.value
  );

  return (
    <ReactPlayer
      ref={playerRef}
      playing={playing}
      className={className}
      url="https://www.youtube.com/watch?v=8ZP5eqm4JqM"
      width="400px"
      height="197px"
      config={{
        youtube: {
          playerVars: { showinfo: 1, enablejsapi: 1 },
        },
      }}
      onReady={() => ytState.ready(playerRef, setValue)}
      onPlay={() => ytState.play(playerRef, dispatch, setValue)}
      onPause={() => ytState.pause(dispatch)}
      onSeek={ytState.seek.bind(ytState)}
      onEnded={() => ytState.end(dispatch)}
    />
  );
});

export default YouTubeContent;
