import { Card, CardBody, HStack, Stack, useTheme } from "@chakra-ui/react";

import InfoInputForm from "./tab-info-child/InfoInputFrom";
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
  useEditMusicSourceAtom,
  useEditPreviewTimeInputAtom,
  useMapArtistNameAtom,
  useMapTitleAtom,
  useTagsAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useSession } from "next-auth/react";
import PreviewTimeInput from "./tab-info-child/PreviewTimeInput";
import TypeLinkButton from "./tab-info-child/TypeLinkButton";
import InfoTag from "./tab-info-child/InfoTag";
import { INITIAL_SERVER_ACTIONS_STATE } from "@/app/edit/ts/const/editDefaultValues";
import { supabase } from "@/lib/supabaseClient";
import { useGetGeminiMapInfoQuery } from "@/app/edit/hooks/query/useGetGeminiMapInfoQuery";

const TabInfoUpload = () => {
  const tags = useTagsAtom();
  const { data: session } = useSession();
  const mapCreatorId = useCreatorIdAtom();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const mapTitle = useMapTitleAtom();
  const artistName = useMapArtistNameAtom();

  const creatorComment = useCreatorCommentAtom();
  const musicSource = useEditMusicSourceAtom();

  const previewTime = useEditPreviewTimeInputAtom();
  const theme: ThemeColors = useTheme();
  const searchParams = useSearchParams();
  const isNewCreateMap = !!searchParams.get("new");

  const { playerRef } = useRefs();
  const { id } = useParams();

  const { isLoading } = useGetGeminiMapInfoQuery();

  const upload = async () => {
    const map = new CreateMap(mapData);
    const mapVideoId = playerRef.current.getVideoData().video_id;
    const videoDuration: number = playerRef.current.getDuration();
    const sendData = {
      videoId: mapVideoId,
      title: mapTitle,
      artistName,
      musicSource: musicSource,
      creatorComment,
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

    const result: UploadResult = await actions(
      sendData,
      mapData,
      Array.isArray(id) ? id[0] : id || "new",
    );

    return result;
  };

  const [state, formAction] = useFormState(upload, INITIAL_SERVER_ACTIONS_STATE);

  const myUserId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";
  const isDisplayUploadButton =
    (myUserId && (!mapCreatorId || Number(myUserId) === mapCreatorId)) || isAdmin;

  return (
    <Card
      variant="filled"
      bg={theme.colors.background.card}
      boxShadow="lg"
      color={theme.colors.text.body}
    >
      <CardBody>
        <Stack display="flex" flexDirection="column" gap="6">
          <InfoInputForm isGeminiLoading={isLoading && isNewCreateMap} />
          <InfoTag isGeminiLoading={isLoading} />
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
      </CardBody>
    </Card>
  );
};

export default TabInfoUpload;
