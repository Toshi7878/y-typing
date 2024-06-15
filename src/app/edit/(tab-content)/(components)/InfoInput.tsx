/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext } from "react-hook-form";
import { Input, FormLabel, Flex, Stack, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../(redux)/store";
import { useEffect } from "react";
import { setCanUpload } from "../../(redux)/buttonFlagsSlice";
import { setCreatorComment, setYtTitle } from "../../(redux)/tabInfoInputSlice";
import { useSearchParams } from "next/navigation";

const InfoInput = () => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { register, setValue } = methods;
  const ytTitle = useSelector((state: RootState) => state.tabInfoInput.title);
  const creatorComment = useSelector((state: RootState) => state.tabInfoInput.creatorComment);
  const searchParams = useSearchParams();

  const videoIdFromState = useSelector((state: RootState) => state.tabInfoInput.videoId);
  const videoId = searchParams.get("new") || videoIdFromState;
  useEffect(() => {
    setValue("title", ytTitle);
  }, [ytTitle]);

  useEffect(() => {
    setValue("creatorComment", creatorComment);
  }, [creatorComment]);

  return (
    <Stack display="flex" flexDirection="column" gap="6">
      <Flex alignItems="center" hidden>
        <FormLabel mb="0" width="150px" fontWeight="bold">
          YouTube URL
        </FormLabel>

        <Input
          placeholder="YouTube URL"
          size="sm"
          {...register("url", { value: `https://www.youtube.com/watch?v=${videoId}` })}
          fontWeight="bold"
        />
        <Button variant={"outline"}>実行</Button>
      </Flex>

      <Flex alignItems="center">
        <FormLabel mb="0" width="150px" fontWeight="bold">
          タイトル
        </FormLabel>

        <Input
          placeholder="曲名 / アーティスト【アニメ名OP】など (必須)"
          size="sm"
          {...register("title")}
          fontWeight="bold"
          onChange={(e) => {
            dispatch(setCanUpload(true));
            dispatch(setYtTitle(e.target.value));
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
          {...register("creatorComment")}
          onChange={(e) => {
            dispatch(setCanUpload(true));
            dispatch(setCreatorComment(e.target.value));
          }}
        />
      </Flex>
    </Stack>
  );
};

export default InfoInput;
