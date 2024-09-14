import { useForm, FormProvider } from "react-hook-form";

import { Card, CardBody, HStack, Stack, useTheme } from "@chakra-ui/react";

import InfoInput from "./tab-info-child/InfoInput";
import InfoGenreTag from "./tab-info-child/InfoGenreTag";
import UploadButton from "./tab-info-child/UploadButton";
import { useSelector } from "react-redux";
import { useFormState } from "react-dom";
import { useParams, useSearchParams } from "next/navigation";
import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { getThumbnailQuality } from "@/app/edit/ts/tab/info-upload/getThumbailQuality";
import { actions } from "@/app/edit/ts/tab/info-upload/serverActions";
import { ThemeColors, UploadResult } from "@/types";
import {
  useCreatorCommentAtom,
  useCreatorIdAtom,
  useEditPreviewTimeInputAtom,
  useMapArtistNameAtom,
  useMapTitleAtom,
  useSetGeminiTagsAtom,
  useSetMapArtistNameAtom,
  useSetMapTitleAtom,
  useTagsAtom,
  useVideoIdAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useSession } from "next-auth/react";
import PreviewTimeInput from "./tab-info-child/PreviewTimeInput";
import TypeLinkButton from "./tab-info-child/TypeLinkButton";
import { GeminiMapInfo, GetYouTubeMovieInfo } from "@/app/edit/ts/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useSuccessToast } from "@/lib/hooks/useSuccessToast";

const TabInfoUpload = () => {
  const tags = useTagsAtom();
  const { data: session } = useSession();
  const mapCreatorId = useCreatorIdAtom();
  const initialState: UploadResult = { id: null, title: "", message: "", status: 0 };
  const methods = useForm();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const mapTitle = useMapTitleAtom();
  const artistName = useMapArtistNameAtom();

  const creatorComment = useCreatorCommentAtom();
  const previewTime = useEditPreviewTimeInputAtom();
  const videoId = useVideoIdAtom();
  const theme: ThemeColors = useTheme();
  const setMapTitle = useSetMapTitleAtom();
  const setMapArtistName = useSetMapArtistNameAtom();
  const setGeminiTags = useSetGeminiTagsAtom();
  const successToast = useSuccessToast();

  const { playerRef } = useRefs();
  const { id } = useParams();

  const upload = async () => {
    const map = new CreateMap(mapData);
    const mapVideoId = playerRef.current.getVideoData().video_id;
    const videoDuration: number = playerRef.current.getDuration();
    const sendData = {
      videoId: mapVideoId,
      title: mapTitle,
      artistName,
      creatorComment,
      mapData,
      tags: tags.map((tag) => tag.id),
      previewTime:
        Number(previewTime) < videoDuration ? previewTime : mapData[map.startLine]["time"],
      romaKpmMedian: map.speedDifficulty.median.r,
      romaKpmMax: map.speedDifficulty.max.r,
      kanaKpmMedian: map.speedDifficulty.median.r,
      kanaKpmMax: map.speedDifficulty.max.r,
      totalTime: map.movieTotalTime,
      romaTotalNotes: map.totalNotes.r,
      kanaTotalNotes: map.totalNotes.k,
      thumbnailQuality: (await getThumbnailQuality(mapVideoId)) as "maxresdefault" | "mqdefault",
    };

    const result: UploadResult = await actions(sendData, Array.isArray(id) ? id[0] : id || "new");

    return result;
  };

  const [state, formAction] = useFormState(upload, initialState);

  const myUserId = session?.user?.id;
  const isDisplayUploadButton = myUserId && (!mapCreatorId || Number(myUserId) === mapCreatorId);

  const searchParams = useSearchParams();
  const isNewCreateMap = !!searchParams.get("new");

  const { data, error, isLoading } = useQuery<GetYouTubeMovieInfo | UploadResult | null>({
    queryKey: ["generate-gemini-map-info", videoId, isNewCreateMap],
    queryFn: async () => {
      const ytInfo = await axios.post<GetYouTubeMovieInfo | UploadResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-youtube-channel-info`,
        { videoId },
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

        if (isNewCreateMap) {
          setMapTitle(mapInfoData.musicTitle);
          setMapArtistName(mapInfoData.artistName);
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

  return (
    <LoadingOverlayWrapper
      active={isLoading}
      spinner={true}
      text="タイトル・アーティスト・関連タグを生成中…"
    >
      <Card
        variant="filled"
        bg={theme.colors.card.bg}
        boxShadow="lg"
        color={theme.colors.card.color}
      >
        <CardBody>
          <FormProvider {...methods}>
            <Stack display="flex" flexDirection="column" gap="6">
              <InfoInput />
              <InfoGenreTag />

              <HStack justifyContent="space-between">
                {isDisplayUploadButton ? (
                  <form action={formAction}>
                    <UploadButton state={state} />
                    {id ? <TypeLinkButton /> : ""}
                  </form>
                ) : id ? (
                  <TypeLinkButton />
                ) : (
                  ""
                )}
                <PreviewTimeInput />
              </HStack>
            </Stack>
          </FormProvider>
        </CardBody>
      </Card>
    </LoadingOverlayWrapper>
  );
};

export default TabInfoUpload;
