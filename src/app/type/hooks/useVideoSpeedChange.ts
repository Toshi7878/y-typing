import { useRefs } from "../type-contexts/refsProvider";
import {
  useSceneAtom,
  useSetPlayingNotifyAtom,
  useSetTypePageSpeedAtom,
  useTypePageSpeedAtom,
} from "../type-atoms/gameRenderAtoms";
import { useGetCurrentLineTime } from "./useGetCurrentLineTime";

export const useVideoSpeedChange = () => {
  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const setNotify = useSetPlayingNotifyAtom();
  const { playerRef, gameStateRef, statusRef } = useRefs();
  const getCurrentLineTime = useGetCurrentLineTime();

  const defaultSpeedChange = (type: "up" | "down" | "set", setSpeed: number = 1) => {
    if (type === "up") {
      if (speedData.defaultSpeed < 2) {
        setSpeed = speedData.defaultSpeed + 0.25;
      }
    } else if (type === "down") {
      if (speedData.defaultSpeed > 0.25) {
        setSpeed = speedData.defaultSpeed + 0.25;
      }
    }

    setSpeedData({ defaultSpeed: setSpeed, playSpeed: setSpeed });
    playerRef.current.setPlaybackRate(setSpeed);

    if (scene === "ready" && gameStateRef.current) {
      gameStateRef.current.startPlaySpeed = setSpeed;
    } else if (scene === "playing") {
      setNotify(Symbol(`${setSpeed.toFixed(2)}x`));
    }
  };

  const playingSpeedChange = (type: "set" | "change" = "change", setSpeed: number = 1) => {
    const defaultSpeed = speedData?.defaultSpeed!;
    const currentSpeed = speedData?.playSpeed!;

    if (type === "change") {
      setSpeed = currentSpeed + 0.25 <= 2 ? currentSpeed + 0.25 : defaultSpeed;
    } else if (type === "set") {
      //
    }

    setSpeedData({
      defaultSpeed,
      playSpeed: setSpeed,
    });

    playerRef.current.setPlaybackRate(setSpeed);

    setNotify(Symbol(`${setSpeed.toFixed(2)}x`));

    if (scene === "playing") {
      const lineTime = getCurrentLineTime();

      statusRef.current!.lineStatus.typeResult.push({
        op: "speedChange",
        t: Math.round(lineTime * 1000) / 1000,
      });
    }
  };

  return { defaultSpeedChange, playingSpeedChange };
};
