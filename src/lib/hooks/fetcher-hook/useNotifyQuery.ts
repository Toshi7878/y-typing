import { QUERY_KEYS } from "@/config/consts";
import { NotificationSelect } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export const useNotifyQuery = () => {
  const { data: session } = useSession();
  const { data, error, isLoading } = useQuery<NotificationSelect[]>({
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

      return newData; // 修正後のデータを返す
    },

    enabled: !!session?.user.id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { data, error, isLoading };
};
