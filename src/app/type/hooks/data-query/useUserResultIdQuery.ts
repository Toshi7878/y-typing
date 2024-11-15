import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

export const useUserResultIdQuery = (userId: number | undefined) => {
  const { id: mapId } = useParams();

  if (!userId) {
    return undefined;
  }
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["practiceData", Number(mapId), userId],
    queryFn: async () => {
      const response = await axios.get<{
        id: number;
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/get-user-result-id`, {
        params: {
          mapId: mapId,
          userId: userId,
        },
      });

      return response.data.id;
    },
    enabled: false,
  });
  return { data, error, isLoading, refetch };
};
