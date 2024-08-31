import { useForm, FormProvider } from "react-hook-form";

import { Card, CardBody, Stack, useTheme, useToast } from "@chakra-ui/react";

import { useEffect } from "react";
import InfoInput from "./tab-info-child/InfoInput";
import InfoGenreTag from "./tab-info-child/InfoGenreTag";
import UploadButton from "./tab-info-child/UploadButton";
import { useDispatch, useSelector } from "react-redux";
import { useFormState } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { getThumbnailQuality } from "@/app/edit/ts/tab/info-upload/getThumbailQuality";
import { actions } from "@/app/edit/ts/tab/info-upload/serverActions";
import { setCanUpload } from "@/app/edit/redux/buttonFlagsSlice";
import { ThemeColors } from "@/types";
import { editCreatorCommentAtom, editMapTitleAtom } from "@/app/edit/edit-atom/editAtom";
import { useAtomValue } from "jotai";

const TabInfoUpload = () => {
  const dispatch = useDispatch();
  const initialState = { id: null, message: "", status: 0 };
  const methods = useForm();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const { tags } = useSelector((state: RootState) => state.genreTag);
  const mapTitle = useAtomValue(editMapTitleAtom);
  const creatorComment = useAtomValue(editCreatorCommentAtom);
  const toast = useToast();
  const theme: ThemeColors = useTheme();

  const { playerRef } = useRefs();
  const { id } = useParams();

  const upload = async () => {
    const map = new CreateMap(mapData);
    const mapVideoId = playerRef.current.getVideoData().video_id;
    const sendData = {
      videoId: mapVideoId,
      title: mapTitle,
      creatorComment,
      mapData,
      tags: tags.map((tag) => tag.id),
      previewTime: mapData[map.startLine]["time"],
      romaKpmMedian: map.speedDifficulty.median.r,
      romaKpmMax: map.speedDifficulty.max.r,
      kanaKpmMedian: map.speedDifficulty.median.r,
      kanaKpmMax: map.speedDifficulty.max.r,
      totalTime: map.movieTotalTime,
      romaTotalNotes: map.totalNotes.r,
      kanaTotalNotes: map.totalNotes.k,
      thumbnailQuality: (await getThumbnailQuality(mapVideoId)) as "maxresdefault" | "mqdefault",
    };

    const result = actions(sendData, Array.isArray(id) ? id[0] : id || "new");

    return result;
  };

  const [state, formAction] = useFormState(upload, initialState);
  const router = useRouter();

  useEffect(() => {
    async function handleStateChange() {
      if (state.status && state.status !== 200) {
        toast({
          title: "保存に失敗しました",
          description: <small>{state.message}</small>,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            border: "1px solid",

            borderColor: "gray.200",
            fontSize: "lg", // サイズを大きくする
          },
        });
      } else if (state.status === 200) {
        toast({
          title: state.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            border: "1px solid",

            borderColor: "gray.200",
            fontSize: "lg", // サイズを大きくする
          },
        });

        dispatch(setCanUpload(false));

        if (!id) {
          router.push(`/edit/${state.id}`);
        }
      }
    }
    handleStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Card variant="filled" bg={theme.colors.card.bg} boxShadow="lg" color={theme.colors.card.color}>
      <CardBody>
        <FormProvider {...methods}>
          <form action={formAction}>
            <Stack display="flex" flexDirection="column" gap="6">
              <InfoInput />
              <InfoGenreTag />
              <UploadButton responseStatus={state.status} />
            </Stack>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export default TabInfoUpload;
