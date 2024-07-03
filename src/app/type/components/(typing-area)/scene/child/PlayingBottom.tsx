import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";
import PlayingSkipGuide from "./child/PlayingSkipGuide";
import PlayingTotalTime from "./child/PlayingTotalTime";
import { mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useEffect } from "react";

const PlayingBottom = forwardRef(function (props, ref) {
  const [map] = useAtom(mapAtom);

  const totalTime = map?.totalTimeSSMM ?? "00:00"; // 'map' が null の場合に対応

  return (
    <Box>
      <HStack justify="space-between" mx="4">
        <PlayingSkipGuide skip={false} />
        <PlayingTotalTime currentTime={"00:00"} totalTime={totalTime} />
      </HStack>
      <PlayingLineProgress />
    </Box>
  );
});

PlayingBottom.displayName = "PlayingBottom";

export default PlayingBottom;
