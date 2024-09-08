"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useIsEditYTStartedAtom, useVideoIdAtom } from "../../edit-atom/editAtom";
import {
  useYTEndStopEvent,
  useYTPauseEvent,
  useYTPlayEvent,
  useYTReadyEvent,
  useYTSeekEvent,
} from "../../hooks/useEditYTEventsHooks";

interface EditorYouTubeProps {
  className: string;
}

const EditYouTube = function ({ className }: EditorYouTubeProps) {
  console.log("YouTube");
  const isYTStarted = useIsEditYTStartedAtom();
  const videoId = useVideoIdAtom();
  const mapData = useSelector((state: RootState) => state.mapData.value);

  const onReady = useYTReadyEvent();
  const onPlay = useYTPlayEvent();
  const onPause = useYTPauseEvent();
  const onEndStop = useYTEndStopEvent();
  const onSeek = useYTSeekEvent();

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
        onSeek(event);
      } else if (event.data === 1) {
        //	未スタート、他の動画に切り替えた時など
        console.log("未スタート -1");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapData, isYTStarted],
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
      onReady={onReady}
      onPlay={onPlay}
      onPause={onPause}
      onEnd={onEndStop}
      onStateChange={handleStateChange}
    />
  );
};

export default EditYouTube;
