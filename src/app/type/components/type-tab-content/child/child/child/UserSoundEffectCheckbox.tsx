import React from "react";
import { Box, Checkbox, CheckboxGroup, Flex, Text } from "@chakra-ui/react";

const UserSoundEffectCheckbox = () => {
  return (
    <Flex>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2} color="#888">
          効果音
        </Text>
        <CheckboxGroup>
          <Checkbox ml={2} mr={2}>
            タイプ音
          </Checkbox>
          <Checkbox ml={2} mr={2}>
            ミス音
          </Checkbox>
          <Checkbox ml={2} mr={2}>
            打ち切り音
          </Checkbox>
        </CheckboxGroup>
      </Box>
    </Flex>
  );
};

export default UserSoundEffectCheckbox;
