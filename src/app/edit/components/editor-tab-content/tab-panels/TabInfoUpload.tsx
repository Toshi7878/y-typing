import { useForm, FormProvider } from "react-hook-form";

import {
  Box,
  Card,
  CardBody,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useTheme,
} from "@chakra-ui/react";

import InfoInput from "./tab-info-child/InfoInput";
import InfoGenreTag from "./tab-info-child/InfoGenreTag";
import UploadButton from "./tab-info-child/UploadButton";
import { useSelector } from "react-redux";
import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
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
  useMapTitleAtom,
  useTagsAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useSession } from "next-auth/react";
import CustomToolTip from "@/components/CustomToolTip";
import PreviewTimeInput from "./tab-info-child/PreviewTimeInput";

const TabInfoUpload = () => {
  const tags = useTagsAtom();
  const { data: session } = useSession();
  const mapCreatorId = useCreatorIdAtom();

  const initialState: UploadResult = { id: null, title: "", message: "", status: 0 };
  const methods = useForm();
  const mapData = useSelector((state: RootState) => state.mapData.value);

  const mapTitle = useMapTitleAtom();
  const creatorComment = useCreatorCommentAtom();
  const previewTime = useEditPreviewTimeInputAtom();

  const theme: ThemeColors = useTheme();

  const { playerRef } = useRefs();
  const { id } = useParams();

  const upload = async () => {
    const map = new CreateMap(mapData);
    const mapVideoId = playerRef.current.getVideoData().video_id;
    const videoDuration: number = playerRef.current.getDuration();
    const sendData = {
      videoId: mapVideoId,
      title: mapTitle,
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
  return (
    <Card variant="filled" bg={theme.colors.card.bg} boxShadow="lg" color={theme.colors.card.color}>
      <CardBody>
        <FormProvider {...methods}>
          <Stack display="flex" flexDirection="column" gap="6">
            <InfoInput />
            <InfoGenreTag />

            <HStack justifyContent="space-between">
              {myUserId && (!mapCreatorId || Number(myUserId) === mapCreatorId) ? (
                <form action={formAction}>
                  <UploadButton state={state} />
                </form>
              ) : null}
              <PreviewTimeInput />
            </HStack>
          </Stack>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export default TabInfoUpload;
