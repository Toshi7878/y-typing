import { Badge, Box, HStack, Kbd } from "@chakra-ui/react";
import PlayingLineProgress from "./child/PlayingLineProgress";
import PlayingSkipGuide, { SkipGuideRef } from "./child/PlayingSkipGuide";
import PlayingTotalTime from "./child/PlayingTotalTime";
import { mapAtom, sceneAtom, speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useRef } from "react";
import PlayingBottomBadge from "./child/PlayingBottomBadge";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";

interface PlayingBottomRef {
  skipGuideRef: React.RefObject<SkipGuideRef>;
  totalTimeProgressRef: React.RefObject<HTMLProgressElement>;
}

const PlayingBottom = function ({ skipGuideRef, totalTimeProgressRef }: PlayingBottomRef) {
  const [map] = useAtom(mapAtom);
  const [scene] = useAtom(sceneAtom);
  const [speedData, setSpeedData] = useAtom(speedAtom);
  const { playerRef } = useRefs();

  const totalTime = map?.totalTimeSSMM ?? "00:00"; // 'map' が null の場合に対応

  const handleRealtimeSpeedChange = () => {
    new YTSpeedController("change", { speedData, setSpeedData, playerRef: playerRef.current });
  };

  return (
    <Box mx="4">
      <HStack
        justify="space-between"
        className={`mx-1 font-bold ${scene !== "playing" ? "invisible" : ""}`}
      >
        <PlayingSkipGuide ref={skipGuideRef} className="opacity-70" />
        <PlayingTotalTime totalTime={totalTime} className="text-2xl font-mono" />
      </HStack>
      <PlayingLineProgress ref={totalTimeProgressRef} />
      <HStack
        justify="space-between"
        className={`mx-3 mt-2 mb-4 font-bold ${scene !== "playing" ? "invisible" : ""}`}
      >
        <PlayingBottomBadge
          badgeText={speedData.realtimeSpeed.toFixed(2) + "倍速"}
          kbdText="F10"
          // onClick={handleRealtimeSpeedChange}
        />
        <PlayingBottomBadge badgeText="やり直し" kbdText="F4" />
      </HStack>
    </Box>
  );
};

PlayingBottom.displayName = "PlayingBottom";

export default PlayingBottom;
