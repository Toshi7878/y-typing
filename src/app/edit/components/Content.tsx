"use client";
import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TimeRange from "./TimeRange";
import { useParams } from "next/navigation";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resetMapData, setMapData } from "../redux/mapDataSlice";
import { resetUndoRedoData } from "../redux/undoredoSlice";
import { Box, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import EditTable from "./editor-table-content/EditTable";
import EditorTabContent from "./editor-tab-content/EditTab";
import {
  useSetCreatorCommentAtom,
  useSetMapTitleAtom,
  useSetTagsAtom,
  useSetVideoIdAtom,
} from "../edit-atom/editAtom";
import ColorStyle from "./ColorStyle";
import EditYouTube from "./editor-youtube-content/EditYoutube";
import { Provider } from "jotai";

function Content() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const theme: ThemeColors = useTheme();
  const isLrcConverting = useSelector((state: RootState) => state.btnFlags.isLrcConverting);
  const setVideoId = useSetVideoIdAtom();
  const setMapTitle = useSetMapTitleAtom();
  const setCreatorComment = useSetCreatorCommentAtom();
  const setTags = useSetTagsAtom();

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
    return () => {
      setVideoId("");
      setMapTitle("");
      setCreatorComment("");
      dispatch(resetMapData());
      setTags({ type: "reset" });
      dispatch(resetUndoRedoData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        >
          <Box
            as="section"
            display="flex"
            flexDirection={{ base: "column", lg: "row" }}
            width="100%"
          >
            <EditYouTube className="mt-1 md:mr-5 md:min-w-[416px] md:max-h-[234px]" />
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