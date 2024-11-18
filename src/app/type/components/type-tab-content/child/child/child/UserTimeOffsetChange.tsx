"use client";
import "@/app/edit/style/editor.scss";
import { ThemeColors } from "@/types";
import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";

const UserTimeOffsetChange = () => {
  const theme: ThemeColors = useTheme();

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
        <Button cursor="pointer" variant="unstyled" size="lg" fontSize="xl">
          -
        </Button>
        <Box fontSize="lg">0.00</Box>
        <Button cursor="pointer" variant="unstyled" size="lg" fontSize="xl">
          +
        </Button>
      </Flex>
    </Flex>
  );
};

export default UserTimeOffsetChange;
