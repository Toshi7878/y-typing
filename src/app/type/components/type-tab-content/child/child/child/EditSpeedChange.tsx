"use client";
import "@/app/edit/style/editor.scss";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";

const UserTimeOffsetChange = () => {
  return (
    <Flex alignItems="baseline" justify="center" className="w-[170px]">
      <Text as="span">{"てすとてすと"}</Text>
      <Box>
        <Button cursor="pointer" variant="unstyled">
          <Box className="relative">-</Box>
        </Button>
      </Box>
      <Box>
        <Text as="span">{"0.00"}</Text>
      </Box>
      <Box>
        <Button variant="unstyled" cursor="pointer">
          <Box className="relative">+</Box>
        </Button>
      </Box>
    </Flex>
  );
};

export default UserTimeOffsetChange;
