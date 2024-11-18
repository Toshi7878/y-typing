import React from "react";
import { Box, Flex, Select, Text } from "@chakra-ui/react";

const UserShortcutKeyCheckbox = () => {
  return (
    <Flex>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2} color="#888">
          ショートカットキー設定
        </Text>
        <Flex alignItems="baseline">
          <Text mr={2}>タイミング調整</Text>
          <Select width="fit-content" defaultValue="left-right">
            <option value="left-right">←→</option>
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
