import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GeminiMapInfo, GetYouTubeMovieInfo } from "../../ts/type";
import { UploadResult } from "@/types";
import {
  useSetEditMusicSourceAtom,
  useSetGeminiTagsAtom,
  useSetMapArtistNameAtom,
  useSetMapTitleAtom,
  useVideoIdAtom,
} from "../../edit-atom/editAtom";
import { useSuccessToast } from "@/lib/hooks/useSuccessToast";
import { useSearchParams } from "next/navigation";

export const useGetGeminiMapInfoQuery = () => {
  const setMapTitle = useSetMapTitleAtom();
  const setMapArtistName = useSetMapArtistNameAtom();
  const setMusicSouce = useSetEditMusicSourceAtom();
  const setGeminiTags = useSetGeminiTagsAtom();
  const successToast = useSuccessToast();
  const videoId = useVideoIdAtom();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new");
  const isBackUp = searchParams.get("backup") === "true";

  const { data, error, isLoading } = useQuery<GetYouTubeMovieInfo | UploadResult | null>({
    queryKey: ["generate-gemini-map-info", videoId, newVideoId],
    queryFn: async () => {
      const ytInfo = await axios.post<GetYouTubeMovieInfo | UploadResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-youtube-channel-info`,
        { videoId: newVideoId ? newVideoId : videoId },
      );

      if ("status" in ytInfo.data && ytInfo.data.status === 404) {
        successToast(ytInfo.data);
        return null;
        // 404エラーの処理をここに追加
      } else {
        const geminiMapInfo = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/generate-map-info-gemini`,
          { prompt_post: ytInfo.data },
        );

        const mapInfoData: GeminiMapInfo = JSON.parse(geminiMapInfo.data.message);

        if (newVideoId && !isBackUp) {
          setMapTitle(mapInfoData.musicTitle);
          setMapArtistName(mapInfoData.artistName);
          setMusicSouce(mapInfoData.musicSource);
        }

        setGeminiTags(mapInfoData.otherTags);
      }

      return ytInfo.data;
    },

    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

  return { isLoading };
};
