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
      const { data }: { data: NotificationSelect[] } = await axios.get(
        "/api/get-user-notification",
        {
          params: { userId: session?.user.id },
        },
      );

      return data;
    },

    enabled: !!session?.user.id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { data, error, isLoading };
};
