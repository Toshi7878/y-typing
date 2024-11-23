import { MapCardInfo } from "@/app/(home)/ts/type";
import { QUERY_KEYS } from "@/config/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCreatedCheckVideoIdQuery(videoId: string) {
  // videoIdを引数として受け取る
  const { data, error, isLoading } = useQuery<MapCardInfo[] | undefined>({
    queryKey: QUERY_KEYS.mapCreatedCheck(videoId),
    queryFn: async () => {
      const response = await axios.get("/api/check-created-youtube-id", {
        params: { videoId },
      });
      console.log("Response:", response.data);

      return response.data;
    },

    enabled: !!videoId, // videoIdが存在する場合にのみ実行
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { data, error, isLoading };
}
