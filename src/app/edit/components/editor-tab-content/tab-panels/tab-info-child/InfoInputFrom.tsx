import { Flex, Stack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import {
  useCreatorCommentAtom,
  useEditMusicSourceAtom,
  useMapArtistNameAtom,
  useMapTitleAtom,
  useSetCreatorCommentAtom,
  useSetEditMusicSourceAtom,
  useSetMapArtistNameAtom,
  useSetMapTitleAtom,
} from "@/app/edit/edit-atom/editAtom";
import InfoInput from "./child/InfoInput";
import VideoIdInput from "./child/VideoIdInput";

interface InfoInputFormProps {
  isGeminiLoading: boolean;
}

const InfoInputForm = (props: InfoInputFormProps) => {
  const setMapTitle = useSetMapTitleAtom();
  const setMapArtistName = useSetMapArtistNameAtom();
  const setCreatorComment = useSetCreatorCommentAtom();
  const setMusicSouce = useSetEditMusicSourceAtom();
  const mapTitle = useMapTitleAtom();
  const mapArtistName = useMapArtistNameAtom();
  const musicSource = useEditMusicSourceAtom();
  const creatorComment = useCreatorCommentAtom();
  const searchParams = useSearchParams();
  const isNewCreateMap = !!searchParams.get("new");

  return (
    <Stack display="flex" flexDirection="column" gap="6">
      <Flex alignItems="center" hidden={isNewCreateMap ? true : false}>
        <VideoIdInput />
      </Flex>

      <Stack>
        <Flex alignItems="center">
          <InfoInput
            label={"曲名タイトル"}
            placeholder="曲名タイトル"
            inputState={mapTitle}
            setInputState={setMapTitle}
            isRequired={true}
            isGeminiLoading={props.isGeminiLoading}
          />
        </Flex>
        <Flex alignItems="center">
          <InfoInput
            label={"アーティスト名"}
            placeholder="アーティスト名"
            inputState={mapArtistName}
            setInputState={setMapArtistName}
            isRequired={true}
            isGeminiLoading={props.isGeminiLoading}
          />
        </Flex>
        <Flex alignItems="center">
          <InfoInput
            label={"ソース"}
            placeholder="曲が使用されているアニメ・ドラマ・映画タイトルを入力"
            inputState={musicSource}
            setInputState={setMusicSouce}
            isRequired={false}
            isGeminiLoading={props.isGeminiLoading}
          />
        </Flex>
      </Stack>
      <Flex alignItems="center">
        <InfoInput
          label={"コメント"}
          placeholder="譜面の情報や感想など、なんでもコメントOKです"
          inputState={creatorComment}
          setInputState={setCreatorComment}
        />
      </Flex>
    </Stack>
  );
};

export default InfoInputForm;
