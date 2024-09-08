"use client";
import { Box, Spinner } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";

import MapCard from "./MapCard";

export interface MapCardInfo {
  id: number;
  title: string;
  videoId: string;
  updatedAt: string;
  previewTime: string;
  difficulty: string;
  thumbnailQuality: "maxresdefault" | "mqdefault";
  user: {
    id: number;
    name: string;
  };
}

async function getMapList(page: number): Promise<MapCardInfo[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map-list`, {
    params: { page }, // ページ数をクエリパラメータとして追加
    // cache: "no-cache", // キャッシュモード
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch data");
  }

  return response.data;
}

function getCurrentPageFromURL() {
  const urlParams = new URLSearchParams(window.location.hash.replace("#", ""));
  return Number(urlParams.get("page")) || 0;
}

function MapList() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["mapList"],
      queryFn: ({ pageParam = 0 }) => getMapList(pageParam), // ページ数を引数として渡す
      initialPageParam: getCurrentPageFromURL(),
      getNextPageParam: (lastPage, allPages) => {
        // ページング処理を修正

        if (lastPage.length > 0) {
          const nextPage = allPages.length;
          return nextPage;
        }

        return undefined;
      },
      staleTime: Infinity, // データを常に新鮮に保つ
      refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
      refetchOnReconnect: false, // 再接続時に再フェッチしない
      refetchOnMount: false, // マウント時に再フェッチしない
    });

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <InfiniteScroll
      loadMore={() => fetchNextPage()}
      loader={<div key={0}>Loading...</div>}
      hasMore={hasNextPage}
      isReverse
    >
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} // 2列表示に変更
        gap={3}
        mb={10}
        w="82vw"
      >
        {data?.pages.map((page) => page.map((map) => <MapCard key={map.id} map={map} />))}{" "}
      </Box>
    </InfiniteScroll>
  );
}

export default MapList;
