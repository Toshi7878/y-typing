"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TimeRange from "./editor-time-range-content/EditTimeRange";
import { useParams, useSearchParams } from "next/navigation";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { resetMapData, setMapData } from "../redux/mapDataSlice";
import { resetUndoRedoData } from "../redux/undoredoSlice";
import { Box } from "@chakra-ui/react";
import { IndexDBOption } from "@/types";
import EditTable from "./editor-table-content/EditTable";
import EditorTabContent from "./editor-tab-content/EditTabList";
import {
  useIsLrcConvertingAtom,
  useSetCanUploadAtom,
  useSetCreatorCommentAtom,
  useSetEditDirectEditCountAtom as useSetDirectEditCountAtom,
  useSetEditLineLyricsAtom,
  useSetEditLineSelectedCountAtom,
  useSetEditLineWordAtom,
  useSetEditMusicSourceAtom,
  useSetEditPreviewTimeInputAtom,
  useSetEditTimeCountAtom,
  useSetGeminiTagsAtom,
  useSetIsEditYTPlayingAtom,
  useSetIsEditYTReadyAtom,
  useSetIsEditYTStartedAtom,
  useSetMapArtistNameAtom,
  useSetMapTitleAtom,
  useSetTagsAtom,
} from "../edit-atom/editAtom";
import ColorStyle from "./ColorStyle";
import EditYouTube from "./editor-youtube-content/EditYoutube";
import { db } from "@/lib/db";
import { useDownloadMapDataQuery } from "../hooks/query/useDownloadMapDataQuery";
import { QUERY_KEYS } from "@/config/consts";
import { useQueryClient } from "@tanstack/react-query";

function Content() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";
  const isBackUp = searchParams.get("backup") === "true";
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
  const setGeminiTags = useSetGeminiTagsAtom();
  const setArtistName = useSetMapArtistNameAtom();
  const setMusicSouce = useSetEditMusicSourceAtom();
  const setLyrics = useSetEditLineLyricsAtom();
  const setCanUpload = useSetCanUploadAtom();
  const setWord = useSetEditLineWordAtom();
  const setDirectEditCountAtom = useSetDirectEditCountAtom();
  const queryClient = useQueryClient();
  const { id: mapId } = useParams();

  const { data, isLoading } = useDownloadMapDataQuery();

  useEffect(() => {
    if (data) {
      dispatch(setMapData(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  useEffect(() => {
    if (!mapId) {
      //新規作成譜面に移動したら初期化
      setMapTitle("");
      setArtistName("");
      setMusicSouce("");
      setCreatorComment("");
      setTags({ type: "reset" });
      dispatch(resetUndoRedoData());
      setPreviewTime("");
    }

    if (isBackUp) {
      db.editorNewCreateBak
        .get({ optionName: "backupMapData" })
        .then((data: IndexDBOption | undefined) => {
          if (data) {
            dispatch(setMapData(data.value));
          }
        });
      setCanUpload(true);
    } else {
      dispatch(resetMapData());
      setCanUpload(false);
    }
    setIsYTStarted(false);
    setIsYTReady(false);
    setIsYTPlaying(false);
    setSelectedCount(null);
    setTimeCount(0);
    setGeminiTags([]);

    return () => {
      setLyrics("");
      setWord("");
      setDirectEditCountAtom(null);
      if (mapId) {
        queryClient.removeQueries({ queryKey: QUERY_KEYS.mapData(mapId) });
      }

      queryClient.removeQueries({ queryKey: QUERY_KEYS.generateMapInfoGemini });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, newVideoId]);

  useEffect(() => {
    window.getSelection()!.removeAllRanges();
  }, []);

  return (
    <LoadingOverlayWrapper active={isLrcConverting} spinner={true} text="Loading...">
      <Box
        as="main"
        display="flex"
        minHeight="100vh"
        paddingX={{ base: 0, md: 14 }}
        flexDirection="column"
        alignItems="center"
        paddingTop="55px"
        width={"100vw"}
      >
        <Box as="section" display="flex" flexDirection={{ base: "column", lg: "row" }} width="100%">
          <EditYouTube className="mt-1 md:mr-5 md:min-w-[416px] md:min-h-[234px] md:max-h-[234px]" />
          <EditorTabContent />
        </Box>
        <Box as="section" width="100%" my={1}>
          <TimeRange />
        </Box>
        <Box as="section" width="100%" mt={0}>
          <EditTable mapLoading={isLoading} />
        </Box>
      </Box>
      <ColorStyle />
    </LoadingOverlayWrapper>
  );
}

export default Content;
