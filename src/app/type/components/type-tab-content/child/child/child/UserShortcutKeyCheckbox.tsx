import React from "react";
import { Box, Flex, Select, Text } from "@chakra-ui/react";
import { useSetUserOptionsAtom, useUserOptionsAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { UserTypingOptions } from "@/app/type/ts/type";
import { sendUpdateData } from "@/app/type/hooks/sendTypingOptionData";

const UserShortcutKeyCheckbox = () => {
  const userOptionsAtom = useUserOptionsAtom();
  const setUserOptionsAtom = useSetUserOptionsAtom();

  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value; // 選択された値を取得
    const newUserOptions: UserTypingOptions = {
      ...userOptionsAtom,
      timeOffsetKey: value as UserTypingOptions["timeOffsetKey"], // 選択された値を設定
    };
    setUserOptionsAtom(newUserOptions);

    sendUpdateData(newUserOptions);
  };

  return (
    <Flex>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2} color="#888">
          ショートカットキー設定
        </Text>
        <Flex alignItems="baseline">
          <Text mr={2}>タイミング調整</Text>
          <Select
            onChange={onSelect}
            width="fit-content"
            defaultValue={userOptionsAtom.timeOffsetKey}
          >
            <option value="ctrl-left-right">Ctrl+←→</option>
            <option value="ctrl-alt-left-right">Ctrl+Alt+←→</option>
            <option value="none">無効化</option>
          </Select>
        </Flex>
      </Box>
    </Flex>
  );
};

export default UserShortcutKeyCheckbox;
