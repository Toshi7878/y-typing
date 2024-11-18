"use client";
import "@/app/edit/style/editor.scss";
import { CHANGE_TIME_OFFSET_VALUE } from "@/app/type/ts/const/typeDefaultValue";
import { useSetUserOptionsAtom, useUserOptionsAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { ThemeColors } from "@/types";
import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";

const UserTimeOffsetChange = () => {
  const theme: ThemeColors = useTheme();
  const setUserOptionsAtom = useSetUserOptionsAtom();
  const userOptionsAtom = useUserOptionsAtom();

  const decrement = () => {
    setUserOptionsAtom({
      ...userOptionsAtom,
      userTimeOffset: userOptionsAtom.userTimeOffset - CHANGE_TIME_OFFSET_VALUE,
    });
  };
  const increment = () => {
    setUserOptionsAtom({
      ...userOptionsAtom,
      userTimeOffset: userOptionsAtom.userTimeOffset + CHANGE_TIME_OFFSET_VALUE,
    });
  };

  return (
    <Flex alignItems="baseline">
      <Text fontSize="lg" fontWeight="semibold" mr={2}>
        全体タイミング調整
      </Text>
      <Flex
        alignItems="baseline"
        border="1px"
        borderColor={`${theme.colors.card.borderColor}90`}
        width="fit-content"
        rounded={"full"}
        fontSize="md"
      >
        <Button onClick={decrement} cursor="pointer" variant="unstyled" size="lg" fontSize="xl">
          -
        </Button>
        <Box fontSize="lg">{userOptionsAtom.userTimeOffset.toFixed(2)}</Box>
        <Button onClick={increment} cursor="pointer" variant="unstyled" size="lg" fontSize="xl">
          +
        </Button>
      </Flex>
    </Flex>
  );
};

export default UserTimeOffsetChange;
