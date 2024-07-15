"use client";

import React, { useCallback } from "react";
import YouTube from "react-youtube";
import { ytState } from "./youtubeEvents";
import { useRefs } from "../../(contexts)/refsProvider"; // 変更
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { sceneAtom } from "../../(atoms)/gameRenderAtoms";

interface YouTubeProps {
  className: string;
  videoId: string;
}

const YouTubeContent = function YouTubeContent({ className, videoId }: YouTubeProps) {
  console.log("YouTube");
  const [, setScene] = useAtom(sceneAtom);
  const refs = useRefs();

  const handleReady = useCallback(
    (event: { target: any }) => {
      const player = event.target;
      refs.setRef("playerRef", player);
      ytState.ready(refs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handlePlay = useCallback(() => {
    ytState.play(setScene, refs.ytStateRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePause = useCallback(() => {
    ytState.pause(refs.ytStateRef);
  }, []);

  const handleEnd = useCallback(() => {
    ytState.end(setScene);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateChange = useCallback((event: any) => {
    if (
      document.activeElement instanceof HTMLIFrameElement &&
      document.activeElement.tagName === "IFRAME"
    ) {
      document.activeElement.blur();
    }

    if (event.data === 3) {
      // seek時の処理
      ytState.seek(event.target, refs.lineCountRef);
    } else if (event.data === 1) {
      //	未スタート、他の動画に切り替えた時など
      console.log("未スタート -1");
    }
  }, []);

  const HEIGHT = (325).toFixed();
  const WIDTH = ((Number(HEIGHT) * 16) / 9).toFixed();
  return (
    <Box style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
      <YouTube
        className={`${className} mt-2`}
        videoId={videoId}
        opts={{
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          playerVars: { enablejsapi: 1 },
        }}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnd={handleEnd}
        onStateChange={handleStateChange}
      />
    </Box>
  );
};

export default YouTubeContent;
