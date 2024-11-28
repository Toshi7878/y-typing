"use client";
import { QUERY_KEYS } from "@/config/consts";
import { GetInfoData } from "@/types/api";
import { Box, Flex } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { RESET } from "jotai/utils";
import { useParams } from "next/navigation";
import { CSSProperties, useEffect } from "react";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import TypeTabContent from "../components/type-tab-content/TypeTab";
import TypeYouTubeContent from "../components/type-youtube-content/TypeYoutubeContent";
import TypingCard from "../components/typing-area/TypingCard";
import { useDownloadMapDataJsonQuery } from "../hooks/data-query/useDownloadMapDataJsonQuery";
import { useDisableKeyHandle } from "../hooks/useDisableKeyHandle";
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
import useWindowScale, { CONTENT_HEIGHT, CONTENT_WIDTH } from "./windowScale";

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

      setMap(null);
      setScene(RESET);
      setNotify(RESET);
      setLineResults([]);
      setLineSelectIndex(0);
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
