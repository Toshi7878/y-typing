import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { LineResultData, SendResultData } from "../../ts/type";
import axios from "axios";
import {
  useSetIsLoadingOverlayAtom,
  useSetLineResultsAtom,
} from "../../type-atoms/gameRenderAtoms";

export const usePracticeDataQuery = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const setIsLoadingOverlay = useSetIsLoadingOverlayAtom();
  const setLineResults = useSetLineResultsAtom();

  const mapId = id;
  const userId = session?.user?.id;
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["practiceData", Number(userId), Number(mapId)],
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
