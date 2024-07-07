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
    <Box mx="4">
      <HStack
        justify="space-between"
        className={`mx-1 font-bold mt-3 mb-1 font-mono ${scene !== "playing" ? "invisible" : ""}`}
      >
        <PlayingCombo comboCount={status.combo} className="text-3xl" />
        <PlayingNotify className="text-3xl" />
        <PlayingLineTime className="text-3xl" />
      </HStack>
      <PlayingLineProgress ref={progressRef} />
    </Box>
  );
}

export default PlayingTop;
