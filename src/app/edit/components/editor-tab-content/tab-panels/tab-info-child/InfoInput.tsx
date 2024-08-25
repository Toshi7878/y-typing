/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext } from "react-hook-form";
import {
  Input,
  FormLabel,
  Flex,
  Stack,
  Button,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCanUpload } from "@/app/edit/redux/buttonFlagsSlice";
import { useSearchParams } from "next/navigation";
import { extractYouTubeVideoId } from "@/components/header/child/right-child/new-map/extractYTId";
import { z } from "zod";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import {
  editCreatorCommentAtom,
  editMapTitleAtom,
  editVideoIdAtom,
  isEditYouTubeStartedAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useAtom, useSetAtom } from "jotai";

const videoIdSchema = z
  .string()
  .length(11)
  .regex(/^[!-~]+$/);

const InfoInput = () => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { playerRef } = useRefs();

  const [canChangeVideo, setCanChangeVideo] = useState(false);
  const setIsYTStarted = useSetAtom(isEditYouTubeStartedAtom);
  const [videoId, setVideoId] = useAtom(editVideoIdAtom);
  const [mapTitle, setMapTitle] = useAtom(editMapTitleAtom);
  const [creatorComment, setCreatorComment] = useAtom(editCreatorCommentAtom);
  const searchParams = useSearchParams();

  // const videoIdFromState = useSelector((state: RootState) => state.tabInfoInput.videoId);
  // const videoId = searchParams.get("new") || videoIdFromState;

  const handleVideoIdChange = (newVideoId: string) => {
    if (videoIdSchema.safeParse(newVideoId).success && videoId !== newVideoId) {
      setCanChangeVideo(true);
    } else {
      setCanChangeVideo(false);
    }
  };
  return (
    <Stack display="flex" flexDirection="column" gap="6">
      <Flex alignItems="center" hidden={!searchParams.get("new") ? false : true}>
        <FormLabel mb="0" width="150px" fontWeight="bold">
          YouTube URL
        </FormLabel>
        <InputGroup size="sm">
          <InputLeftAddon>https://www.youtube.com/watch?v=</InputLeftAddon>

          <Input
            placeholder="YouTube URL(動画URLをそのまま貼り付けできます)"
            size="sm"
            maxLength={11} // YouTubeのID11文字に制限
            fontWeight="bold"
            value={videoId}
            onPaste={async (e) => {
              const url = await navigator.clipboard.readText();
              const inputElement = e.target as HTMLInputElement;
              const videoId = extractYouTubeVideoId(url);
              if (videoId) {
                inputElement.value = videoId;
                handleVideoIdChange(videoId);
              }
            }}
            onChange={(e) => handleVideoIdChange(e.target.value)}
          />
          <Button
            variant={"outline"}
            colorScheme={canChangeVideo ? "yellow" : ""}
            opacity={canChangeVideo ? 1 : 0.5}
            cursor={canChangeVideo ? "" : "not-allowed"}
            onClick={() => {
              if (canChangeVideo) {
                setIsYTStarted(false);
                playerRef.current.cueVideoById({ videoId: methods.getValues("url") });
              }
            }}
          >
            切替
          </Button>
        </InputGroup>
      </Flex>

      <Flex alignItems="center">
        <FormLabel mb="0" width="150px" fontWeight="bold">
          タイトル
        </FormLabel>

        <Input
          isInvalid={mapTitle === ""}
          placeholder="曲名 / アーティスト【アニメ名OP】など"
          size="sm"
          fontWeight="bold"
          value={mapTitle}
          onChange={(e) => {
            dispatch(setCanUpload(true));
            setMapTitle(e.target.value);
          }}
        />
      </Flex>
      <Flex alignItems="center">
        <FormLabel mb="0" width="150px" fontWeight="bold">
          コメント
        </FormLabel>
        <Input
          placeholder="譜面の情報や感想など、なんでもコメントOKです"
          size="sm"
          value={creatorComment}
          onChange={(e) => {
            dispatch(setCanUpload(true));
            setCreatorComment(e.target.value);
          }}
        />
      </Flex>
    </Stack>
  );
};

export default InfoInput;
