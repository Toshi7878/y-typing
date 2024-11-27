"use client";
import React, { CSSProperties, useEffect } from "react";
import TypeYouTubeContent from "../components/type-youtube-content/TypeYoutubeContent";
import { useParams } from "next/navigation";
import TypeTabContent from "../components/type-tab-content/TypeTab";
import { Box, Flex } from "@chakra-ui/react";
import { GetInfoData } from "@/types/api";
import {
  useIsLoadingOverlayAtom,
  useSetLineResultsAtom,
  useSetLineSelectIndexAtom,
  useSetMapAtom,
  useSetPlayingNotifyAtom,
  useSetRankingScoresAtom,
  useSetSceneAtom,
  useSetTimeOffsetAtom,
  useSetTypePageSpeedAtom,
} from "../type-atoms/gameRenderAtoms";
import TypingCard from "../components/typing-area/TypingCard";
import useWindowScale, { CONTENT_HEIGHT, CONTENT_WIDTH } from "./windowScale";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useDownloadMapDataJsonQuery } from "../hooks/data-query/useDownloadMapDataJsonQuery";
import { QUERY_KEYS } from "@/config/consts";
import { useQueryClient } from "@tanstack/react-query";
import { useDisableKeyHandle } from "../hooks/useDisableKeyHandle";
import { RESET } from "jotai/utils";

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  const { scale } = useWindowScale();
  const { videoId, title, creatorComment, tags } = mapInfo;
  const { id: mapId } = useParams();
  const setMap = useSetMapAtom();
  const setScene = useSetSceneAtom();
  const setRankingScores = useSetRankingScoresAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const setLineResults = useSetLineResultsAtom();
  const setLineSelectIndex = useSetLineSelectIndexAtom();
  const setTimeOffset = useSetTimeOffsetAtom();
  const { isLoading } = useDownloadMapDataJsonQuery();
  const isLoadingOverlay = useIsLoadingOverlayAtom();
  const queryClient = useQueryClient();
  const disableKeyHandle = useDisableKeyHandle();

  useEffect(() => {
    window.addEventListener("keydown", disableKeyHandle);

    return () => {
      window.removeEventListener("keydown", disableKeyHandle);
      // コンポーネントのアンマウント時にクエリキャッシュをクリア
      queryClient.removeQueries({ queryKey: QUERY_KEYS.mapData(mapId) });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.mapRanking(mapId) });

      setMap(RESET);
      setScene(RESET);
      setNotify(RESET);
      setLineResults([]);
      setLineSelectIndex(null);
      setTimeOffset(0);
      setRankingScores([]);
      setSpeedData({
        defaultSpeed: 1,
        playSpeed: 1,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, queryClient]);

  const style: CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: "top",
    width: `${CONTENT_WIDTH}px`,
    height: `${CONTENT_HEIGHT}px`,
  };

  return (
    <LoadingOverlayWrapper active={isLoadingOverlay} spinner={true} text="Loading...">
      <Flex
        as="main"
        id="main_content"
        flexDirection="column"
        alignItems="center"
        pt={16}
        width="100vw"
        height="100vh"
      >
        <Box style={style}>
          <Flex direction="column">
            <Flex gap="6">
              <TypeYouTubeContent
                className={`w-[513px] ${isLoading ? "invisible" : ""} aspect-video mt-2`}
                videoId={videoId}
              />
              <Box flex={{ base: "8" }} flexDirection="column">
                <TypeTabContent />
              </Box>
            </Flex>
            <Box mt={5}>
              <TypingCard />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </LoadingOverlayWrapper>
  );
}

export default Content;
