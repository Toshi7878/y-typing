"use client";
import "@/app/edit/style/editor.scss";
import { ThemeColors } from "@/types";
import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";

const UserTimeOffsetChange = () => {
  const theme: ThemeColors = useTheme();

  return (
    <Flex
      alignItems="baseline"
      border="1px"
      borderColor={theme.colors.card.borderColor}
      width="fit-content"
      rounded={"full"}
      pl={4}
      fontSize="md"
    >
      <Box>時間調整</Box>
      <Button cursor="pointer" variant="unstyled" size="lg" fontSize="xl">
        -
      </Button>
      <Box fontSize="lg">0.00</Box>
      <Button cursor="pointer" variant="unstyled" size="lg" fontSize="xl">
        +
      </Button>
    </Flex>
  );
};

export default UserTimeOffsetChange;
