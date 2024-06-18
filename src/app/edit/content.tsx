"use client";
import React, { useLayoutEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./(redux)/store";
import TabContent from "./(tab-content)/Tab";
import TableContent from "./(table-content)/TableContent";
import TimeRange from "./TimeRange";
import YouTubeContent from "./(youtube-content)/YoutubeConent";
import { setCreatorComment, setVideoId, setYtTitle } from "./(redux)/tabInfoInputSlice";
import { setGenre, setTags } from "./(redux)/GenreTagSlice";
import { useParams } from "next/navigation";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { setMapData } from "./(redux)/mapDataSlice";
const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ContentInner mapInfo={mapInfo} />
      </Provider>
    </QueryClientProvider>
  );
}

function ContentInner({ mapInfo }: { mapInfo: GetInfoData }) {
  const { videoId, title, creatorComment, genre, tags } = mapInfo;
  const dispatch = useDispatch();
  const { id } = useParams();
  const isLrcConverting = useSelector((state: RootState) => state.btnFlags.isLrcConverting);

  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData"],
    queryFn: async () => {
      if (!id) return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      dispatch(setMapData(data.mapData));
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: 0, // データを常に新鮮に保つ
  });

  useLayoutEffect(() => {
    if (id) {
      dispatch(setVideoId(videoId));
      dispatch(setYtTitle(title));
      dispatch(setCreatorComment(creatorComment));
      dispatch(setGenre(genre));
      dispatch(setTags(tags));
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
