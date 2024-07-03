import { Box } from "@chakra-ui/react";
import React from "react";

const PlayingSkipGuide = ({ skip }: { skip: boolean }) => {
  return (
    <Box fontWeight="bold" fontSize="sm">
      {skip ? `Type Space key to Skip. ⏩` : ""}
    </Box>
  );
};

export default PlayingSkipGuide;
