import {
  Input,
  FormLabel,
  Flex,
  Stack,
  Button,
  InputLeftAddon,
  InputGroup,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { extractYouTubeVideoId } from "@/components/header/child/right-child/new-map/extractYTId";
import { z } from "zod";
import {
  useCreatorCommentAtom,
  useMapArtistNameAtom,
  useMapTitleAtom,
  useSetCanUploadAtom,
  useSetCreatorCommentAtom,
  useSetIsEditYTStartedAtom,
  useSetMapArtistNameAtom,
  useSetMapTitleAtom,
  useSetVideoIdAtom,
  useVideoIdAtom,
} from "@/app/edit/edit-atom/editAtom";
import { ThemeColors } from "@/types";

const videoIdSchema = z
  .string()
  .length(11)
  .regex(/^[!-~]+$/);

const InfoInput = () => {
  const theme: ThemeColors = useTheme();
  const videoId = useVideoIdAtom();

  const [changeVideoId, setChangeVideoId] = useState(videoId); // atomの値を初期値に設定
  const setIsYTStarted = useSetIsEditYTStartedAtom();
  const setCanUpload = useSetCanUploadAtom();
  const setMapTitle = useSetMapTitleAtom();
  const setMapArtistName = useSetMapArtistNameAtom();
  const setCreatorComment = useSetCreatorCommentAtom();
  const setVideoId = useSetVideoIdAtom();
  const mapTitle = useMapTitleAtom();
  const mapArtistName = useMapArtistNameAtom();
  const creatorComment = useCreatorCommentAtom();
  const searchParams = useSearchParams();
  const isNewCreateMap = !!searchParams.get("new");

  const canChangeVideo =
    videoIdSchema.safeParse(changeVideoId).success && videoId !== changeVideoId;
  return (
    <Stack display="flex" flexDirection="column" gap="6">
      <Flex alignItems="center" hidden={isNewCreateMap ? true : false}>
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
            value={changeVideoId}
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            onPaste={async (e) => {
              const url = await navigator.clipboard.readText();
              const inputElement = e.target as HTMLInputElement;
              const videoId = extractYouTubeVideoId(url);
              if (videoId) {
                inputElement.value = videoId;
                setChangeVideoId(videoId);
              }
            }}
            onChange={(e) => setChangeVideoId(e.target.value)}
          />
          <Button
            variant={"outline"}
            colorScheme={canChangeVideo ? "yellow" : ""}
            opacity={canChangeVideo ? 1 : 0.5}
            cursor={canChangeVideo ? "" : "not-allowed"}
            onClick={() => {
              if (canChangeVideo) {
                setIsYTStarted(false);
                setVideoId(changeVideoId);
              }
            }}
          >
            切替
          </Button>
        </InputGroup>
      </Flex>

      <Stack>
        <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold" fontSize="sm">
            曲名タイトル
          </FormLabel>

          <Input
            isInvalid={mapTitle === ""}
            placeholder="曲名"
            size="sm"
            fontWeight="bold"
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            value={mapTitle}
            onChange={(e) => {
              setCanUpload(true);
              setMapTitle(e.target.value);
            }}
          />
        </Flex>
        <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold" fontSize="sm">
            アーティスト名
          </FormLabel>

          <Input
            isInvalid={mapArtistName === ""}
            placeholder="アーティスト名"
            size="sm"
            fontWeight="bold"
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            value={mapArtistName}
            onChange={(e) => {
              setCanUpload(true);
              setMapArtistName(e.target.value);
            }}
          />
        </Flex>
      </Stack>
      <Flex alignItems="center">
        <FormLabel mb="0" width="150px" fontWeight="bold">
          コメント
        </FormLabel>
        <Input
          placeholder="譜面の情報や感想など、なんでもコメントOKです"
          size="sm"
          value={creatorComment}
          bg={theme.colors.background}
          borderColor={`${theme.colors.card.borderColor}60`}
          onChange={(e) => {
            setCanUpload(true);
            setCreatorComment(e.target.value);
          }}
        />
      </Flex>
    </Stack>
  );
};

export default InfoInput;
