"use client";
import React, { CSSProperties, useEffect } from "react";
import TypeYouTubeContent from "../components/type-youtube-content/TypeYoutubeContent";
import { useParams } from "next/navigation";
import TypeTabContent from "../components/type-tab-content/TypeTab";
import { Box, Flex, useTheme } from "@chakra-ui/react";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreateMap } from "../ts/scene-ts/ready/createTypingWord";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  inputModeAtom,
  isHoverDrawerLabelAtom,
  lineResultsAtom,
  lineSelectIndexAtom,
  loadingOverlayAtom,
  mapAtom,
  mapIdAtom,
  playingNotifyAtom,
  rankingScoresAtom,
  sceneAtom,
  speedAtom,
} from "../type-atoms/gameRenderAtoms";
import SceneWrapper from "../components/typing-area/Scene";
import useWindowScale, { CONTENT_HEIGHT, CONTENT_WIDTH } from "./windowScale";
import NProgress from "nprogress";
import { InputModeType } from "../ts/type";
import LoadingOverlayWrapper from "react-loading-overlay-ts";

export const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    NProgress.done();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ContentInner mapInfo={mapInfo} />
    </QueryClientProvider>
  );
}

function ContentInner({ mapInfo }: { mapInfo: GetInfoData }) {
  const { scale } = useWindowScale();
  const [isHovering, setIsHovering] = useAtom(isHoverDrawerLabelAtom);
  const scene = useAtomValue(sceneAtom);
  const { videoId, title, creatorComment, tags } = mapInfo;
  const { id } = useParams();
  const setMap = useSetAtom(mapAtom);
  const setScene = useSetAtom(sceneAtom);
  const setMapId = useSetAtom(mapIdAtom);
  const setRankingScores = useSetAtom(rankingScoresAtom);
  const setSpeedData = useSetAtom(speedAtom);
  const setInputMode = useSetAtom(inputModeAtom);
  const setNotify = useSetAtom(playingNotifyAtom);
  const setLineResults = useSetAtom(lineResultsAtom);
  const setLineSelectIndex = useSetAtom(lineSelectIndexAtom);
  const theme = useTheme();

  const isLoadingOverlay = useAtomValue(loadingOverlayAtom);

  //useQueryYouTubeコンポーネントで行う（あとでやる
  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      setMapId(Number(id));

      if (!id) return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      const map = new CreateMap(data.mapData);
      setMap(map);
      setLineResults(map.defaultLineResultData);

      return;
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });
  useEffect(() => {
    return () => {
      // コンポーネントのアンマウント時にクエリキャッシュをクリア
      queryClient.removeQueries({ queryKey: ["mapData", id] });
      setMap(null); // 追加: アンマウント時にsetMap(null)を呼び出す
      setScene("ready");
      setNotify(Symbol(""));
      setLineResults([]);
      const inputMode = (localStorage.getItem("inputMode") as InputModeType) || "roma";
      setLineSelectIndex(null);
      setInputMode(inputMode);
      setRankingScores([]);
      setSpeedData({
        defaultSpeed: 1,
        playSpeed: 1,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, queryClient]);

  const style: CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: "top",
    width: `${CONTENT_WIDTH}px`,
    height: `${CONTENT_HEIGHT}px`,
  };

  return (
    <LoadingOverlayWrapper active={isLoadingOverlay} spinner={true} text="Loading...">
      <Box
        as="main"
        id="main_content"
        className="flex flex-col items-center pt-16"
        width={"100vw"}
        height={"100vh"}
        bg={"background"}
      >
        {(scene === "practice" || scene === "replay") && (
          <Box
            position="fixed"
            right={0}
            top={0}
            bottom={0}
            width="50px"
            borderLeft="2px solid"
            borderColor={theme.colors.card.borderColor}
            cursor="pointer"
            zIndex="100"
            onMouseEnter={() => {
              if (!isHovering) {
                setIsHovering(true);
              }
            }}
          />
        )}
        <Box style={style}>
          <Flex direction="column">
            <Flex gap="6">
              <Box className="">
                <TypeYouTubeContent
                  className={` w-[512px] ${isLoading ? "invisible" : ""} aspect-video mt-2`}
                  videoId={videoId}
                />
              </Box>
              <Box flex={{ base: "8" }} flexDirection="column">
                <TypeTabContent />
              </Box>
            </Flex>
            <Box className=" mt-5">
              <SceneWrapper />
            </Box>
          </Flex>
        </Box>
      </Box>
    </LoadingOverlayWrapper>
  );
}

export default Content;
