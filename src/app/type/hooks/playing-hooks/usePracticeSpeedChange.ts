import { YTSpeedController } from "../../ts/ytHandleEvents";
import {
  useSetPlayingNotifyAtom,
  useSetTypePageSpeedAtom,
  useTypePageSpeedAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";

export const useChangePracticeSpeed = () => {
  const { playerRef } = useRefs();
  const speedData = useTypePageSpeedAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const setNotify = useSetPlayingNotifyAtom();

  return (changeType: "up" | "down") => {
    const result = new YTSpeedController(changeType, {
      speedData,
      setSpeedData,
      playerRef: playerRef!.current,
    });

    if (result.result) {
      setNotify(Symbol(`${result.result!.toFixed(2)}x`));
    }
  };
};
