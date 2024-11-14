"use client";
import InfiniteScroll from "react-infinite-scroller";
import MapCard from "./MapCard";
import SkeletonCard from "./SkeletonCard";
import MapCardLayout from "./MapCardLayout";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMapListInfiniteQuery } from "../hooks/useMapListInfiniteQuery";

function LoadingMapCard({ cardLength }: { cardLength: number }) {
  return (
    <MapCardLayout>
      {[...Array(cardLength)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </MapCardLayout>
  );
}

function MapList() {
  const searchParams = useSearchParams();
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
    refetch,
  } = useMapListInfiniteQuery();

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (status === "pending") {
    return <LoadingMapCard cardLength={10} />;
  }

  return (
    <InfiniteScroll
      loadMore={() => fetchNextPage()}
      loader={<LoadingMapCard cardLength={2} />}
      hasMore={hasNextPage}
      threshold={1400} // スクロールの閾値を追加
    >
      <MapCardLayout>
        {data?.pages.map((page) => page.map((map) => <MapCard key={map.id} map={map} />))}
      </MapCardLayout>
    </InfiniteScroll>
  );
}

export default MapList;
