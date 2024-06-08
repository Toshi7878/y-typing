import { useFormContext } from "react-hook-form";

import { Input, FormLabel, Flex, Stack } from "@chakra-ui/react";

import UploadTab from "./UploadTab";

const InfoTab = () => {
  const { register } = useFormContext();

  return (
    <form>
      <Stack display="flex" flexDirection="column" gap="6">
        {/* <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold">
            YouTube URL
          </FormLabel>

          <Input placeholder="YouTube URL" size="sm" {...register("url")} fontWeight="bold" />
        </Flex> */}

        <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold">
            タイトル
          </FormLabel>

          <Input placeholder="タイトル" size="sm" {...register("title")} fontWeight="bold" />
        </Flex>
        <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold">
            コメント
          </FormLabel>
          <Input placeholder="" size="sm" {...register("creatorComment")} />
        </Flex>
        <UploadTab />
      </Stack>
    </form>
  );
};

export default InfoTab;
