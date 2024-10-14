import { Box } from "@chakra-ui/react";
import React from "react";

const ResultCardLayout = ({ children }) => {
  return (
    <Box
      className="w-[100%] md:w-[90vw] lg:w-[90vw] 2xl:w-[65vw]"
      display="grid"
      gridTemplateColumns={{ base: "1fr" }}
      gap={3}
      mb={3}
    >
      {children}
    </Box>
  );
};

export default ResultCardLayout;
