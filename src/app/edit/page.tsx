// ts
"use client";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";
// export const runtime = "edge";

export default function Home() {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
    },
  };

  return <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={onPlayerReady} />;
}
