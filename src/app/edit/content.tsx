"use client";
import React, { useEffect, useLayoutEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import editStore, { RootState } from "./(redux)/store";
import TabContent from "./(tab-content)/Tab";
import TableContent from "./(table-content)/TableContent";
import TimeRange from "./TimeRange";
import YouTubeContent from "./(youtube-content)/YoutubeContent";
import {
  resetYtData,
  setCreatorComment,
  setVideoId,
  setYtTitle,
} from "./(redux)/tabInfoInputSlice";
import { resetTags, setTags } from "./(redux)/GenreTagSlice";
import { useParams } from "next/navigation";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { resetMapData, setMapData } from "./(redux)/mapDataSlice";
import NProgress from "nprogress";
import { resetUndoRedoData } from "./(redux)/undoredoSlice";
import { ChakraProvider } from "@chakra-ui/react";
import { getTheme } from "../customTheme";
const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    NProgress.done();
  }, []);
  return (
    <ChakraProvider theme={getTheme("dark")}>
      <QueryClientProvider client={queryClient}>
        <Provider store={editStore}>
          <ContentInner mapInfo={mapInfo} />
        </Provider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

function ContentInner({ mapInfo }: { mapInfo: GetInfoData }) {
  const { videoId, title, creatorComment, tags } = mapInfo;
  const dispatch = useDispatch();
  const { id } = useParams();
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
      <main className="flex min-h-screen sm:px-0 flex-col items-center pt-14 md:px-14">
        <section className="flex flex-col lg:flex-row w-full ">
          <YouTubeContent className="md:mr-5 md:min-w-[384px] md:min-h-[216px]" videoId={videoId} />
          <TabContent className="w-full border-black" />
        </section>
        <section className="w-full mt-2">
          <TimeRange />
        </section>
        <section className="w-full mt-3">
          <TableContent />
        </section>
      </main>
    </LoadingOverlayWrapper>
  );
}

export default Content;
