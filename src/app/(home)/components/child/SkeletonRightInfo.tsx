"use client";
import { Box } from "@chakra-ui/react";

function SkeletonRightInfo() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="start"
      h="full"
      width={{ base: "100%", xl: "65%" }}
      pl={3}
      pt={2}
      fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
      _hover={{ textDecoration: "none" }} // 追加: ホバー時の下線を無効化する
    ></Box>
  );
}

export default SkeletonRightInfo;
