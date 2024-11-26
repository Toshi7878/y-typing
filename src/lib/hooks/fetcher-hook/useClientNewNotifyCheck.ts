import { QUERY_KEYS } from "@/config/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export function useClientNewNotifyCheck() {
  const { data: session } = useSession();
  const userId = session?.user.id || "";
  const { data, error, isLoading } = useQuery<boolean>({
    queryKey: QUERY_KEYS.clientNewNotifyCheck,
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/new-notification-check`);
      const params: Record<string, string> = { userId };

      url.search = new URLSearchParams(params).toString();

      const { data } = await axios.get(url.toString(), {
        params,
      });

      return data.checked === undefined ? false : true;
    },

    enabled: !!userId, // videoIdが存在する場合にのみ実行
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 60000, // 60秒ごとに再取得
  });

  return { data, error, isLoading };
}
