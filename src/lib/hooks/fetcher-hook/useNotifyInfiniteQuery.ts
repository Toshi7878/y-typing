import { NOTIFICATION_TAKE_LENGTH } from "@/app/api/get-user-notification/route";
import { QUERY_KEYS } from "@/config/consts";
import { NotificationSelect } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export const useNotifyInfiniteQuery = () => {
  const { data: session } = useSession();
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
    isLoading,
  } = useInfiniteQuery<NotificationSelect[]>({
    queryKey: QUERY_KEYS.notification,
    queryFn: async () => {
      const { data } = await axios.get("/api/get-user-notification", {
        params: { userId: session?.user.id },
      });

      const newData = data.map((notifyData) => {
        if (Array.isArray(notifyData.map.mapLike)) {
          notifyData.map.mapLike = notifyData.map.mapLike[0]; // 配列の最初の要素を取得
        }

        if (Array.isArray(notifyData.map.result)) {
          notifyData.map.result = notifyData.map.result[0]; // 配列の最初の要素を取得
        }

        return notifyData;
      });

      return newData;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === NOTIFICATION_TAKE_LENGTH) {
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

    enabled: !!session?.user.id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
  };
};
