import React from "react";
import { Box, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useSetUserOptionsAtom, useUserOptionsAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { sendUpdateData } from "@/app/type/hooks/sendTypingOptionData";
import { UserTypingOptions } from "@/app/type/ts/type";

const UserNextDisplayRadioButton = () => {
  const setUserOptionsAtom = useSetUserOptionsAtom();
  const userOptionsAtom = useUserOptionsAtom();

  const changeRadio = (value: string) => {
    // 引数を追加
    const newUserOptions: UserTypingOptions = {
      ...userOptionsAtom,
      nextDisplay: value as UserTypingOptions["nextDisplay"], // 選択された値を設定
    };
    setUserOptionsAtom(newUserOptions);

    sendUpdateData(newUserOptions);
  };
  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        次の歌詞表示
      </Text>
      <RadioGroup defaultValue="lyrics" onChange={changeRadio}>
        <Stack direction="row" spacing={5}>
          <Radio value="lyrics">歌詞</Radio>
          <Radio value="word">ワード</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default UserNextDisplayRadioButton;
