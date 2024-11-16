import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  useSetLineResultsAtom,
  useSetMapAtom,
  useSetMapIdAtom,
} from "../../type-atoms/gameRenderAtoms";
import { CreateMap } from "../../ts/scene-ts/ready/createTypingWord";

export const useDownloadMapDataJsonQuery = () => {
  const { id } = useParams();
  const setMapId = useSetMapIdAtom();
  const setLineResults = useSetLineResultsAtom();
  const setMap = useSetMapAtom();

  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      setMapId(Number(id));

      if (!id) return;
      try {
        const timestamp = new Date().getTime(); // 一意のクエリパラメータを生成

        const { data, error } = await supabase.storage
          .from("map-data") // バケット名を指定
          .download(`public/${id}.json?timestamp=${timestamp}`);

        if (error) {
          console.error("Error downloading from Supabase:", error);
          throw error;
        }

        const jsonString = await data.text();
        const jsonData = JSON.parse(jsonString);

        const map = new CreateMap(jsonData);
        setMap(map);
        setLineResults(map.defaultLineResultData);
        return jsonData;
      } catch (error) {
        console.error("Error processing the downloaded file:", error);
        throw error;
      }
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });
  return { data, error, isLoading };
};
