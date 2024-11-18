import { RefObject } from "react";
import { SkipGuideRef } from "../../components/typing-area/scene/playing-child/child/PlayingSkipGuide";
import { CreateMap } from "../../ts/scene-ts/ready/createTypingWord";
import {
  useMapAtom,
  useTypePageSpeedAtom,
  useUserOptionsAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";

export const usePressSkip = () => {
  const { statusRef, gameStateRef, ytStateRef, playerRef } = useRefs();
  const map = useMapAtom() as CreateMap;
  const speedData = useTypePageSpeedAtom();
  const userOptionsAtom = useUserOptionsAtom();

  return (skipGuideRef: RefObject<SkipGuideRef>) => {
    const nextLine = map!.mapData[statusRef.current!.status.count];
    const skippedTime =
      (gameStateRef.current!.isRetrySkip
        ? Number(map!.mapData[map!.startLine]["time"])
        : Number(nextLine["time"])) - userOptionsAtom.timeOffset;

    const seekTime =
      nextLine["lyrics"] === "end"
        ? ytStateRef.current!.movieDuration - 2
        : skippedTime - 1 + (1 - speedData.playSpeed);

    playerRef.current.seekTo(seekTime);
    gameStateRef.current!.isRetrySkip = false;
    skipGuideRef.current?.setSkipGuide?.("");
  };
};
