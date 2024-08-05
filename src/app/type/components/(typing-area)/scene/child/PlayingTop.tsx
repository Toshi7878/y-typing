import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";

import PlayingCombo from "./child/PlayingCombo";
import PlayingLineTime, { PlayingLineTimeRef } from "./child/PlayingLineTime";
import PlayingNotify from "./child/PlayingNotify";
import { sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtomValue } from "jotai";
import { useRef } from "react";

interface PlayingTopProps {
  lineProgressRef: React.RefObject<HTMLProgressElement>;
  PlayingRemainTimeRef: React.RefObject<PlayingLineTimeRef>;
}
function PlayingTop({ lineProgressRef, PlayingRemainTimeRef }: PlayingTopProps) {
  const scene = useAtomValue(sceneAtom);

  const playingComboRef = useRef(null);

  const isPlayed = scene === "playing" || scene === "replay" || scene === "practice";

  return (
    <Box mx="8">
      <HStack
        justify="space-between"
        className={`mx-1 font-bold mt-3 mb-1 font-mono ${isPlayed ? "" : "invisible"}`}
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
