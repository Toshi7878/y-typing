import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";

import PlayingCombo from "./child/PlayingCombo";
import PlayingLineTime from "./child/PlayingLineTime";
import PlayingNotify from "./child/PlayingNotify";
import { statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";

function PlayingTop({ progressRef }) {
  const [status] = useAtom(statusAtom);

  return (
    <Box>
      <HStack justify="space-between" mx="4">
        <PlayingCombo comboCount={status.combo} />
        <PlayingNotify />
        <PlayingLineTime />
      </HStack>
      <PlayingLineProgress ref={progressRef} />
    </Box>
  );
}

export default PlayingTop;
