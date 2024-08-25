"use client";
import React, { useEffect, useLayoutEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import editStore, { RootState } from "./redux/store";
import TimeRange from "./TimeRange";
import { resetYtData, setCreatorComment, setVideoId, setYtTitle } from "./redux/tabInfoInputSlice";
import { resetTags, setTags } from "./redux/GenreTagSlice";
import { useParams } from "next/navigation";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resetMapData, setMapData } from "./redux/mapDataSlice";
import NProgress from "nprogress";
import { resetUndoRedoData } from "./redux/undoredoSlice";
import { Box, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import YouTubeContent from "../(home)/components/YouTubeContent";
import EditorTable from "./components/editor-table-content/TableContent";
import EditorTabContent from "./components/editor-tab-content/EditorTab";
const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    NProgress.done();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={editStore}>
        <ContentInner mapInfo={mapInfo} />
      </Provider>
    </QueryClientProvider>
  );
}

function ContentInner({ mapInfo }: { mapInfo: GetInfoData }) {
  const { videoId, title, creatorComment, tags } = mapInfo;
  const dispatch = useDispatch();
  const { id } = useParams();
  const theme: ThemeColors = useTheme();
  const isLrcConverting = useSelector((state: RootState) => state.btnFlags.isLrcConverting);

  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      if (!id) return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      dispatch(setMapData(data.mapData));
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

  useLayoutEffect(() => {
    if (id) {
      dispatch(setVideoId(videoId));
      dispatch(setYtTitle(title));
      dispatch(setCreatorComment(creatorComment));
      dispatch(setTags(tags));
    } else {
      dispatch(resetMapData());
      dispatch(resetTags());
      dispatch(resetYtData());
      dispatch(resetUndoRedoData());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingOverlayWrapper active={isLrcConverting} spinner={true} text="Loading...">
      <Box
        as="main"
        bg={theme.colors.background}
        display="flex"
        minHeight="100vh"
        paddingX={{ base: 0, md: 14 }}
        flexDirection="column"
        alignItems="center"
        paddingTop={14}
      >
        <Box as="section" display="flex" flexDirection={{ base: "column", lg: "row" }} width="100%">
          <YouTubeContent className="md:mr-5 md:min-w-[384px] md:min-h-[216px]" />
          <EditorTabContent />
        </Box>
        <Box as="section" width="100%" mt={2}>
          <TimeRange />
        </Box>
        <Box as="section" width="100%" mt={3}>
          <EditorTable />
        </Box>
      </Box>
    </LoadingOverlayWrapper>
  );
}

export default Content;
