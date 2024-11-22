"use client";
import InfiniteScroll from "react-infinite-scroller";
import MapCard from "../../../components/map-card/MapCard";
import SkeletonCard from "../../../components/map-card/SkeletonCard";
import MapCardLayout from "./MapCardLayout";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMapListInfiniteQuery } from "../hooks/useMapListInfiniteQuery";
import { queryClient } from "../HomeProvider";

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

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["mapList"] });
    };
  }, []);

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
        {data?.pages.map((page) =>
          page.map((map) => <MapCard key={map.id} map={map} maxW={"100%"} />),
        )}
      </MapCardLayout>
    </InfiniteScroll>
  );
}

export default MapList;
