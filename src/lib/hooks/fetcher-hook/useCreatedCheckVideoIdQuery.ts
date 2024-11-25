import { MapCardInfo } from "@/app/(home)/ts/type";
import { QUERY_KEYS } from "@/config/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCreatedCheckVideoIdQuery(videoId: string) {
  // videoIdを引数として受け取る
  const { data, error, isLoading } = useQuery<MapCardInfo[] | undefined>({
    queryKey: QUERY_KEYS.mapCreatedCheck(videoId),
    queryFn: async () => {
      const { data } = await axios.get("/api/check-created-youtube-id", {
        params: { videoId },
      });

      const newData = data.map((map) => {
        if (Array.isArray(map.mapLike)) {
          map.mapLike = map.mapLike[0]; // 配列の最初の要素を取得
        }

        if (Array.isArray(map.result)) {
          map.result = map.result[0]; // 配列の最初の要素を取得
        }

        return map;
      });

      return newData; // 修正後のデータを返す
    },

    enabled: !!videoId, // videoIdが存在する場合にのみ実行
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { data, error, isLoading };
}
