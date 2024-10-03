"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";

import { MapCardInfo } from "../ts/type";

async function getMapList(page: number): Promise<MapCardInfo[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users-results-list`, {
    params: { page }, // ページ数をクエリパラメータとして追加
    // cache: "no-cache", // キャッシュモード
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch data");
  }

  return response.data;
}

function UsersResultList() {
  const {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["usersResultList"],
    queryFn: ({ pageParam = 0 }) => getMapList(pageParam), // ページ数を引数として渡す
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // ページング処理を修正

      if (lastPage.length > 0) {
        const nextPage = allPages.length;
        return nextPage;
      }

      return undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      // 前のページを取得するための処理
      if (allPages.length > 1) {
        return allPages.length - 2;
      }

      return undefined;
    },
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

  if (status === "pending") {
    // return <LoadingMapCard />;
  }

  return (
    <InfiniteScroll
      loadMore={() => fetchNextPage()}
      // loader={<LoadingMapCard />}
      hasMore={hasNextPage}
      threshold={1400} // スクロールの閾値を追加
    >
      {/* <MapCardLayout>
        {data?.pages.map((page) => page.map((map) => <MapCard key={map.id} map={map} />))}
      </MapCardLayout> */}
    </InfiniteScroll>
  );
}

export default UsersResultList;
