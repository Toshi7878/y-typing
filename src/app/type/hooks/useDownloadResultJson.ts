import { supabase } from "@/lib/supabaseClient";
import { useSetIsLoadingOverlayAtom } from "../type-atoms/gameRenderAtoms";

export const useDownloadResultJson = () => {
  const setIsLoadingOverlay = useSetIsLoadingOverlayAtom();

  return async (resultId: number) => {
    setIsLoadingOverlay(true);

    try {
      const { data, error } = await supabase.storage
        .from("user-result") // バケット名を指定
        .download(`public/${resultId}.json`);

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
    } finally {
      setIsLoadingOverlay(false);
    }
  };
};
