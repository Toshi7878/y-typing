"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRefs } from "../../edit-contexts/refsProvider";
import { ytState } from "../../ts/youtube-ts/editYoutubeEvents";
import {
  editTimeCountAtom,
  isEditYouTubePlayingAtom,
  isEditYouTubeReadyAtom,
  isEditYouTubeStartedAtom,
  useSetMapTitleAtom,
  useSetTabIndexAtom,
  useVideoIdAtom,
} from "../../edit-atom/editAtom";
import { useAtom, useSetAtom } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

interface EditorYouTubeProps {
  className: string;
}

const EditYouTube = function ({ className }: EditorYouTubeProps) {
  console.log("YouTube");
  const dispatch = useDispatch();
  const setTabIndex = useSetTabIndexAtom();
  const setIsReady = useSetAtom(isEditYouTubeReadyAtom);
  const setIsYTPlaying = useSetAtom(isEditYouTubePlayingAtom);
  const setTimeCount = useSetAtom(editTimeCountAtom);
  const [isYTStarted, setIsYTStarted] = useAtom(isEditYouTubeStartedAtom);
  const setMapTitle = useSetMapTitleAtom();
  const videoId = useVideoIdAtom();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";

  const mapData = useSelector((state: RootState) => state.mapData.value);
  const refs = useRefs();
  const { id } = useParams();

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      NProgress.done();
      refs.setRef("playerRef", player);
      const isNewMap = id ? false : true;
      ytState.ready(refs, setMapTitle, setIsReady, dispatch, isNewMap);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
        ytState.seek(event, setTimeCount, mapData);
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
      videoId={videoId ? videoId : newVideoId}
      opts={{
        width: "100%",
        height: "100%",
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
