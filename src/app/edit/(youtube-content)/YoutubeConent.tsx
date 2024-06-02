// ts
"use client";
import React from "react";
import ReactPlayer from "react-player/lazy";
import { ytState } from "./youtubeEvents";
// export const runtime = "edge";

export interface playerRefProps {
  className: string;
  playerRef: React.RefObject<ReactPlayer>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function YouTubeContent({
  className,
  playerRef,
  playing,
  setPlaying,
}: playerRefProps) {
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
      onReady={ytState.ready.bind(ytState)}
      onPlay={() => ytState.play(playerRef, setPlaying)}
      onPause={() => ytState.pause(setPlaying)}
      onSeek={ytState.seek.bind(ytState)}
      onEnded={() => ytState.end(setPlaying)}
    />
  );
}
