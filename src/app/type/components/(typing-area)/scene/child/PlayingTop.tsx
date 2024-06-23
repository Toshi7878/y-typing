import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";

import PlayingCombo from "./child/PlayingCombo";
import PlayingLineTime from "./child/PlayingLineTime";
import PlayingNotify from "./child/PlayingNotify";

function PlayingTop({ progressRef }) {
  return (
    <Box>
      <HStack justify="space-between" mx="4">
        <PlayingCombo />
        <PlayingNotify />
        <PlayingLineTime />
      </HStack>
      <PlayingLineProgress ref={progressRef} />
    </Box>
  );
}

export default PlayingTop;
