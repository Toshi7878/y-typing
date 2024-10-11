import { useQuery } from "@tanstack/react-query";
import { LineResultData, SendResultData } from "../../ts/type";
import axios from "axios";
import {
  useSetIsLoadingOverlayAtom,
  useSetLineResultsAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useParams } from "next/navigation";

export const usePracticeDataQuery = (userId: number) => {
  const { mapId } = useParams();
  const setIsLoadingOverlay = useSetIsLoadingOverlayAtom();
  const setLineResults = useSetLineResultsAtom();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["practiceData", Number(mapId), userId],
    queryFn: async () => {
      setIsLoadingOverlay(true);

      const response = await axios.get<{
        lineResult: LineResultData[];
        status: SendResultData["status"];
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/replay`, {
        params: {
          mapId: mapId,
          userId: userId,
        },
      });

      setIsLoadingOverlay(false);

      setLineResults(response.data!.lineResult);

      return response.data;
    },
    enabled: false,
  });
  return { data, error, isLoading, refetch };
};
