import { QUERY_KEYS } from "@/config/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

export const useUserResultIdQuery = (userId: number | undefined) => {
  const { id: mapId } = useParams();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.practiceData(mapId),
    queryFn: async () => {
      const response = await axios.get<{
        id: number;
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/get-user-result-id`, {
        params: {
          mapId: mapId,
          userId: userId,
        },
      });

      return response.data;
    },
    enabled: !userId, // userIdが存在する場合のみクエリを有効にする
  });

  return { data, error, isLoading, refetch };
};
