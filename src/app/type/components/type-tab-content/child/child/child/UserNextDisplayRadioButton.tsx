import React from "react";
import { Box, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";

const UserNextDisplayRadioButton = () => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        次の歌詞表示
      </Text>
      <RadioGroup defaultValue="lyrics">
        <Stack direction="row" spacing={5}>
          <Radio value="lyrics">歌詞</Radio>
          <Radio value="word">ワード</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default UserNextDisplayRadioButton;
