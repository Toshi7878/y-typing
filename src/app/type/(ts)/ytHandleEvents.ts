import { Dispatch } from "react";
import { Speed } from "./type";

interface UpdateProps {
  speedData?: Speed;
  setSpeedData: Dispatch<Speed>;
  playerRef: any;
  speed?: number;
  defaultSpeed?: number;
}

export class YTSpeedController {
  constructor(
    changeName: string,
    { speedData, setSpeedData, playerRef, speed: setSpeed, defaultSpeed }: UpdateProps,
  ) {
    if (changeName === "up") {
      this.speedUp({ setSpeedData, playerRef });
    } else if (changeName === "down") {
      this.speedDown({ setSpeedData, playerRef });
    } else if (changeName === "setSpeed") {
      this.speedChange(speedData!.defaultSpeed, setSpeed!, { setSpeedData, playerRef });
    } else if (changeName === "setDefaultSpeed") {
      this.speedChange(defaultSpeed!, setSpeed!, { setSpeedData, playerRef });
    }
  }

  speedUp({ setSpeedData, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed < 2) {
      const NEW_SPEED = currentSpeed + 0.25;
      this.speedChange(NEW_SPEED, NEW_SPEED, { setSpeedData, playerRef });
    }
  }

  speedDown({ setSpeedData, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed > 0.25) {
      const NEW_SPEED = currentSpeed - 0.25;
      this.speedChange(NEW_SPEED, NEW_SPEED, { setSpeedData, playerRef });
    }
  }
  speedChange(defaultSpeed: number, playSpeed: number, { setSpeedData, playerRef }: UpdateProps) {
    setSpeedData({ defaultSpeed: defaultSpeed, playSpeed: playSpeed });
    playerRef.setPlaybackRate(playSpeed);
  }
}

export function realtimeChange({ speedData, setSpeedData, playerRef }: UpdateProps) {
  const playSpeed = speedData?.defaultSpeed!;
  const realtimeSpeed = speedData?.playSpeed!;
  const newRealTimeSpeed = realtimeSpeed + 0.25 <= 2 ? realtimeSpeed + 0.25 : playSpeed;

  setSpeedData({
    ...speedData!,
    playSpeed: newRealTimeSpeed,
  });

  playerRef.setPlaybackRate(newRealTimeSpeed);

  return newRealTimeSpeed;
}
