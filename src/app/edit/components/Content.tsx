"use client";
import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import TimeRange from "./TimeRange";
import { useParams, useSearchParams } from "next/navigation";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resetMapData, setMapData } from "../redux/mapDataSlice";
import { resetUndoRedoData } from "../redux/undoredoSlice";
import { Box, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import EditTable from "./editor-table-content/EditTable";
import EditorTabContent from "./editor-tab-content/EditTabList";
import {
  useIsLrcConvertingAtom,
  useSetCreatorCommentAtom,
  useSetEditLineSelectedCountAtom,
  useSetEditPreviewTimeInputAtom,
  useSetEditTimeCountAtom,
  useSetIsEditYTPlayingAtom,
  useSetIsEditYTReadyAtom,
  useSetIsEditYTStartedAtom,
  useSetMapTitleAtom,
  useSetTagsAtom,
} from "../edit-atom/editAtom";
import ColorStyle from "./ColorStyle";
import EditYouTube from "./editor-youtube-content/EditYoutube";
import { Provider } from "jotai";

function Content() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";

  const theme: ThemeColors = useTheme();
  const isLrcConverting = useIsLrcConvertingAtom();
  const setMapTitle = useSetMapTitleAtom();
  const setCreatorComment = useSetCreatorCommentAtom();
  const setPreviewTime = useSetEditPreviewTimeInputAtom();
  const setTags = useSetTagsAtom();
  const setIsYTStarted = useSetIsEditYTStartedAtom();
  const setIsYTReady = useSetIsEditYTReadyAtom();
  const setIsYTPlaying = useSetIsEditYTPlayingAtom();
  const setTimeCount = useSetEditTimeCountAtom();
  const setSelectedCount = useSetEditLineSelectedCountAtom();

  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      if (!id) return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      const mapData = data.mapData;
      const previewTime = data.previewTime;
      dispatch(setMapData(mapData));
      setPreviewTime(previewTime);
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

  useLayoutEffect(() => {
    if (!id) {
      //新規作成譜面に移動したら初期化
      setMapTitle("");
      setCreatorComment("");
      setTags({ type: "reset" });
      dispatch(resetUndoRedoData());
      setPreviewTime("");
      dispatch(resetMapData());
    }

    setIsYTStarted(false);
    setIsYTReady(false);
    setIsYTPlaying(false);
    setSelectedCount(null);
    setTimeCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, newVideoId]);

  useEffect(() => {
    window.getSelection()!.removeAllRanges();
  }, []);

  return (
    <Provider>
      <LoadingOverlayWrapper active={isLrcConverting} spinner={true} text="Loading...">
        <Box
          as="main"
          bg={theme.colors.background}
          display="flex"
          minHeight="100vh"
          paddingX={{ base: 0, md: 14 }}
          flexDirection="column"
          alignItems="center"
          paddingTop="55px"
          width={"100vw"}
        >
          <Box
            as="section"
            display="flex"
            flexDirection={{ base: "column", lg: "row" }}
            width="100%"
          >
            <EditYouTube className="mt-1 md:mr-5 md:min-w-[416px] md:min-h-[234px] md:max-h-[234px]" />
            <EditorTabContent />
          </Box>
          <Box as="section" width="100%" my={1}>
            <TimeRange />
          </Box>
          <Box as="section" width="100%" mt={0}>
            <EditTable />
          </Box>
        </Box>
        <ColorStyle />
      </LoadingOverlayWrapper>
    </Provider>
  );
}

export default Content;
