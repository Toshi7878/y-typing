import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMapData } from "../../redux/mapDataSlice";

export const useDownloadMapDataQuery = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.storage
          .from("map-data") // バケット名を指定
          .download(`public/${id}.json`);

        if (error) {
          console.error("Error downloading from Supabase:", error);
          throw error;
        }

        const jsonString = await data.text();
        const jsonData = JSON.parse(jsonString);

        dispatch(setMapData(jsonData));
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

  return { isLoading };
};
