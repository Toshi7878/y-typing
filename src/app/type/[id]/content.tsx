"use client";
import React, { CSSProperties, useEffect } from "react";
import TypeYouTubeContent from "../components/type-youtube-content/TypeYoutubeContent";
import { useParams } from "next/navigation";
import TypeTabContent from "../components/type-tab-content/TypeTab";
import { Box, Flex } from "@chakra-ui/react";
import { GetInfoData } from "@/types/api";
import {
  useIsLoadingOverlayAtom,
  useSetInputModeAtom,
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
import { InputModeType } from "../ts/type";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { queryClient } from "./TypeProvider";
import { useDownloadMapDataJsonQuery } from "../hooks/data-query/useDownloadMapDataJsonQuery";
import { QUERY_KEYS } from "@/config/consts";

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  const { scale } = useWindowScale();
  const { videoId, title, creatorComment, tags } = mapInfo;
  const { id: mapId } = useParams();
  const setMap = useSetMapAtom();
  const setScene = useSetSceneAtom();
  const setRankingScores = useSetRankingScoresAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const setInputMode = useSetInputModeAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const setLineResults = useSetLineResultsAtom();
  const setLineSelectIndex = useSetLineSelectIndexAtom();
  const setTimeOffset = useSetTimeOffsetAtom();
  const { isLoading } = useDownloadMapDataJsonQuery();
  const isLoadingOverlay = useIsLoadingOverlayAtom();

  useEffect(() => {
    return () => {
      // コンポーネントのアンマウント時にクエリキャッシュをクリア
      queryClient.removeQueries({ queryKey: QUERY_KEYS.mapData(mapId) });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.mapRanking(mapId) });

      setMap(null); // 追加: アンマウント時にsetMap(null)を呼び出す
      setScene("ready");
      setNotify(Symbol(""));
      setLineResults([]);
      const inputMode = (localStorage.getItem("inputMode") as InputModeType) || "roma";
      setLineSelectIndex(null);
      setInputMode(inputMode);
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
        width={"100vw"}
        height={"100vh"}
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
