import { supabase } from "@/lib/supabaseClient";

export const useDownloadResultJson = () => {
  return async (resultId: number) => {
    try {
      const timestamp = new Date().getTime(); // 一意のクエリパラメータを生成

      const { data, error } = await supabase.storage
        .from("user-result") // バケット名を指定
        .download(`public/${resultId}.json?timestamp=${timestamp}`);

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
