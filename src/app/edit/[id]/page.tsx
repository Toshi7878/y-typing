"use client";
import React, { useState, useEffect } from "react";
import TabContent from "../(tab-content)/Tab";
import TableContent from "../(table-content)/TableContent";
import TimeRange from "../TimeRange";
import YouTubeContent from "../(youtube-content)/YoutubeConent";
import { Provider, useDispatch } from "react-redux";
import store from "../(redux)/store";
import InfoTabProvider from "../(contexts)/InfoTabProvider";
import { RefsProvider } from "../(contexts)/refsProvider";
import { useParams } from "next/navigation";
import axios from "axios";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { setCreatorComment, setYtTitle } from "../(redux)/tabInfoInputSlice";
import { setGenre, setTags } from "../(redux)/GenreTagSlice";
import { setMapData } from "../(redux)/mapDataSlice";
// あとでやる
//ローカルDBに直前の{videoid, mapData}をバックアップ保存する機能
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const queryClient = new QueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (typeof window === "undefined" || !isMounted) {
    return null; // クライアントサイドでのみレンダリングする
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <InfoTabProvider>
          <RefsProvider>
            <Content />
          </RefsProvider>
        </InfoTabProvider>
      </Provider>
    </QueryClientProvider>
  );
}

function Content() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isPending } = useQuery({
    queryKey: ["map"],
    queryFn: () =>
      axios.get(`/api/map?id=${id}`).then((res) => {
        updateStore(res.data, dispatch);
        console.log(res.data);
        return res.data;
      }),
  });

  if (!isPending) {
    console.log("Content Render");
  }
  return (
    <main className="flex min-h-screen sm:px-0 flex-col items-center pt-14 md:px-14">
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
          <section className="flex flex-col lg:flex-row w-full ">
            <YouTubeContent
              className="md:mr-5 md:min-w-[384px] md:min-h-[216px]"
              videoId={data.videoId}
            />
            <TabContent className="w-full border-black" />
          </section>
          <section className="w-full mt-2">
            <TimeRange />
          </section>
          <section className="w-full mt-3">
            <TableContent />
          </section>
        </>
      )}
    </main>
  );
}

function updateStore(data, dispatch) {
  dispatch(setYtTitle(data.title));
  dispatch(setGenre(data.genre));
  dispatch(setTags(data.tags));
  dispatch(setMapData(data.mapData));
  dispatch(setCreatorComment(data.creatorComment));
}
