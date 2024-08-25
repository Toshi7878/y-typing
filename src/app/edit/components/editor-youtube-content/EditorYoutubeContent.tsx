"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRefs } from "../../edit-contexts/refsProvider";
import { ytState } from "../../ts/youtube-ts/editYoutubeEvents";
import { editTabIndexAtom } from "../../edit-atom/editAtom";
import { useSetAtom } from "jotai";

interface EditorYouTubeProps {
  className: string;
  videoId: string;
}

const EditorYouTubeContent = function YouTubeContent({ className, videoId }: EditorYouTubeProps) {
  console.log("YouTube");
  const setTabIndex = useSetAtom(editTabIndexAtom);

  const dispatch = useDispatch();

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const playerState = useSelector((state: RootState) => state.ytState);
  const refs = useRefs();
  const ytTitle = useSelector((state: RootState) => state.tabInfoInput.title);

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      refs.setRef("playerRef", player);
      ytState.ready(refs, dispatch, ytTitle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ytTitle],
  );

  const handlePlay = useCallback(() => {
    ytState.play(refs.playerRef, dispatch, setTabIndex, playerState.isStarted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerState.isStarted]);

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

  const HEIGHT = "216px";

  return (
    <YouTube
      className={className}
      videoId={videoId}
      opts={{
        width: "100%",
        height: HEIGHT,
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

export default EditorYouTubeContent;
