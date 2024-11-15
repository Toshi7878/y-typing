import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export const useDownloadMapDataJson = () => {
  const { id: mapId } = useParams();

  return async () => {
    try {
      const { data, error } = await supabase.storage
        .from("map-data") // バケット名を指定
        .download(`public/${mapId}.json`);

      if (error) {
        console.error("Error downloading from Supabase:", error);
        throw error;
      }

      const jsonString = await data.text();
      const jsonData = JSON.parse(jsonString);
      return jsonData;
    } catch (error) {
      console.error("Error processing the downloaded file:", error);
      throw error;
    }
  };
};
