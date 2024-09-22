import { realtimeChange, YTSpeedController } from "../../ts/ytHandleEvents";
import {
  useSetPlayingNotifyAtom,
  useSetTypePageSpeedAtom,
  useTypePageSpeedAtom,
} from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";

export const useRealTimeSpeedChange = () => {
  const { playerRef } = useRefs();
  const speedData = useTypePageSpeedAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const setNotify = useSetPlayingNotifyAtom();

  return () => {
    const newSpeed = realtimeChange({
      speedData,
      setSpeedData,
      playerRef: playerRef.current,
    });

    setNotify(Symbol(`${newSpeed.toFixed(2)}x`));
  };
};

export const useSetRealTimeSpeed = () => {
  const { playerRef } = useRefs();
  const speedData = useTypePageSpeedAtom();
  const setSpeedData = useSetTypePageSpeedAtom();

  return (speed: number) => {
    new YTSpeedController("setSpeed", {
      speedData,
      setSpeedData,
      playerRef: playerRef.current,
      speed,
    });
  };
};
