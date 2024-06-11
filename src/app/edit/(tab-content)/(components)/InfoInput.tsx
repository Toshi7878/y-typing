/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext } from "react-hook-form";
import { Input, FormLabel, Flex, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../(redux)/store";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const InfoInput = () => {
  const methods = useFormContext();
  const { register, setValue } = methods;
  const ytTitle = useSelector((state: RootState) => state.ytTitle.title);
  const searchParams = useSearchParams();
  const videoId = searchParams.get("new") || "";

  useEffect(() => {
    setValue("title", ytTitle);
  }, [ytTitle]);

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
        />
      </Flex>
    </Stack>
  );
};

export default InfoInput;
