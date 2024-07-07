import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";
import PlayingSkipGuide, { SkipGuideRef } from "./child/PlayingSkipGuide";
import PlayingTotalTime from "./child/PlayingTotalTime";
import { mapAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useRef } from "react";

interface PlayingBottomRef {
  skipGuideRef: React.RefObject<SkipGuideRef>;
}

const PlayingBottom = function ({ skipGuideRef }: PlayingBottomRef) {
  const [map] = useAtom(mapAtom);
  const [scene] = useAtom(sceneAtom);

  const totalTime = map?.totalTimeSSMM ?? "00:00"; // 'map' が null の場合に対応

  return (
    <Box mx="4" mb="3">
      <HStack
        justify="space-between"
        className={`mx-1 font-bold font-mono ${scene !== "playing" ? "invisible" : ""}`}
      >
        <PlayingSkipGuide ref={skipGuideRef} className="opacity-80" />
        <PlayingTotalTime totalTime={totalTime} className="text-2xl" />
      </HStack>
      <PlayingLineProgress />
    </Box>
  );
};

PlayingBottom.displayName = "PlayingBottom";

export default PlayingBottom;
