import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";

import PlayingCombo from "./child/PlayingCombo";
import PlayingLineTime, { PlayingLineTimeRef } from "./child/PlayingLineTime";
import PlayingNotify from "./child/PlayingNotify";
import { sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { useRef } from "react";

interface PlayingTopProps {
  lineProgressRef: React.RefObject<HTMLProgressElement>;
  PlayingRemainTimeRef: React.RefObject<PlayingLineTimeRef>;
}
function PlayingTop({ lineProgressRef, PlayingRemainTimeRef }: PlayingTopProps) {
  const [scene] = useAtom(sceneAtom);

  const playingComboRef = useRef(null);

  return (
    <Box mx="6">
      <HStack
        justify="space-between"
        className={`mx-1 font-bold mt-3 mb-1 font-mono ${scene !== "playing" ? "invisible" : ""}`}
      >
        <PlayingCombo className="text-3xl" ref={playingComboRef} />
        <PlayingNotify className="text-3xl" />
        <PlayingLineTime className="text-3xl" ref={PlayingRemainTimeRef} />
      </HStack>
      <PlayingLineProgress ref={lineProgressRef} />
    </Box>
  );
}

export default PlayingTop;
