"use client";
import InfiniteScroll from "react-infinite-scroller";
import ResultCard from "./result-card/ResultCard";
import ResultCardLayout from "./result-card/ResultCardLayout";
import { useUsersResultInfiniteQuery } from "../hooks/useUsersResultInfiniteQuery";

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
  } = useUsersResultInfiniteQuery();

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
      <ResultCardLayout>
        {data?.pages.map((page) =>
          page.map((result) => <ResultCard key={result.id} result={result} />),
        )}
      </ResultCardLayout>
    </InfiniteScroll>
  );
}

export default UsersResultList;
