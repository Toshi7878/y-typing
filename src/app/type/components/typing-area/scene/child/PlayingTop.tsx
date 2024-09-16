import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "../playing-child/child/PlayingLineProgress";

import PlayingCombo from "../playing-child/child/PlayingCombo";
import PlayingLineTime, { PlayingLineTimeRef } from "../playing-child/child/PlayingLineTime";
import PlayingNotify from "../playing-child/child/PlayingNotify";
import { useRef } from "react";
import { useSceneAtom } from "@/app/type/type-atoms/gameRenderAtoms";

interface PlayingTopProps {
  lineProgressRef: React.RefObject<HTMLProgressElement>;
  PlayingRemainTimeRef: React.RefObject<PlayingLineTimeRef>;
}
function PlayingTop({ lineProgressRef, PlayingRemainTimeRef }: PlayingTopProps) {
  const scene = useSceneAtom();

  const playingComboRef = useRef(null);

  const isPlayed = scene === "playing" || scene === "replay" || scene === "practice";

  return (
    <Box mx="8">
      <HStack
        justify="space-between"
        className={`mx-1 font-bold mt-3 mb-1 font-mono ${isPlayed ? "" : "invisible"} top-card-text`}
      >
        <PlayingCombo className="text-3xl" ref={playingComboRef} />
        <PlayingNotify className="text-3xl text-center" />
        <PlayingLineTime className="text-3xl" ref={PlayingRemainTimeRef} />
      </HStack>
      <PlayingLineProgress ref={lineProgressRef} id="line_progress" />
    </Box>
  );
}

export default PlayingTop;
