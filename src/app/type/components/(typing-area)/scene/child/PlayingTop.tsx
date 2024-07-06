import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";

import PlayingCombo from "./child/PlayingCombo";
import PlayingLineTime from "./child/PlayingLineTime";
import PlayingNotify from "./child/PlayingNotify";
import { sceneAtom, statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";

function PlayingTop({ progressRef }) {
  const [status] = useAtom(statusAtom);
  const [scene] = useAtom(sceneAtom);

  return (
    <Box>
      <HStack
        justify="space-between"
        mx="4"
        className={`text-2xl font-bold mt-2 ${scene !== "playing" ? "invisible" : ""}`}
      >
        <PlayingCombo comboCount={status.combo} />
        <PlayingNotify />
        <PlayingLineTime />
      </HStack>
      <PlayingLineProgress ref={progressRef} />
    </Box>
  );
}

export default PlayingTop;
