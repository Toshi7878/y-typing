import { Box } from "@chakra-ui/react";
import React from "react";

const MapCardLayout = ({ children }) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} // 2列表示に変更
      gap={3}
      mb={3}
    >
      {children}
    </Box>
  );
};

export default MapCardLayout;
