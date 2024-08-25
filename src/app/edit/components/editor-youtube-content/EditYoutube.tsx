"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRefs } from "../../edit-contexts/refsProvider";
import { ytState } from "../../ts/youtube-ts/editYoutubeEvents";
import {
  editMapTitleAtom,
  editTabIndexAtom,
  isEditYouTubePlayingAtom,
  isEditYouTubeReadyAtom,
  isEditYouTubeStartedAtom,
} from "../../edit-atom/editAtom";
import { useAtom, useSetAtom } from "jotai";

interface EditorYouTubeProps {
  className: string;
  videoId: string;
}

const EditYouTube = function ({ className, videoId }: EditorYouTubeProps) {
  console.log("YouTube");
  const setTabIndex = useSetAtom(editTabIndexAtom);
  const setIsReady = useSetAtom(isEditYouTubeReadyAtom);
  const setIsYTPlaying = useSetAtom(isEditYouTubePlayingAtom);
  const [isYTStarted, setIsYTStarted] = useAtom(isEditYouTubeStartedAtom);
  const dispatch = useDispatch();
  const [mapTitle, setMapTitle] = useAtom(editMapTitleAtom);
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const refs = useRefs();

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      refs.setRef("playerRef", player);
      ytState.ready(refs, setMapTitle, setIsReady, mapTitle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapTitle],
  );

  const handlePlay = useCallback(() => {
    ytState.play(refs.playerRef, setIsYTPlaying, setTabIndex, setIsYTStarted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYTStarted]);

  const handlePause = useCallback(() => {
    ytState.pause(setIsYTPlaying);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = useCallback(() => {
    ytState.end(setIsYTPlaying);
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
        ytState.seek(event, dispatch, mapData);
      } else if (event.data === 1) {
        //	未スタート、他の動画に切り替えた時など
        if (!isYTStarted) {
          event.target.seekTo(0);
        }
        console.log("未スタート -1");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapData, isYTStarted],
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

export default EditYouTube;
