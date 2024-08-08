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
  result: number | null;
  constructor(
    changeName: string,
    { speedData, setSpeedData, playerRef, speed: setSpeed, defaultSpeed }: UpdateProps,
  ) {
    this.result = null;
    if (changeName === "up") {
      this.result = this.speedUp({ setSpeedData, playerRef });
    } else if (changeName === "down") {
      this.result = this.speedDown({ setSpeedData, playerRef });
    } else if (changeName === "setSpeed") {
      this.speedChange(speedData!.defaultSpeed, setSpeed!, { setSpeedData, playerRef });
    } else if (changeName === "setDefaultSpeed") {
      this.speedChange(defaultSpeed!, setSpeed!, { setSpeedData, playerRef });
    }
  }

  speedUp({ setSpeedData, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();
    let result: number | null = null;

    if (currentSpeed < 2) {
      const NEW_SPEED = currentSpeed + 0.25;
      result = this.speedChange(NEW_SPEED, NEW_SPEED, { setSpeedData, playerRef });
    }

    return result;
  }

  speedDown({ setSpeedData, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();
    let result: number | null = null;

    if (currentSpeed > 0.25) {
      const NEW_SPEED = currentSpeed - 0.25;
      result = this.speedChange(NEW_SPEED, NEW_SPEED, { setSpeedData, playerRef });
    }

    return result;
  }

  speedChange(defaultSpeed: number, playSpeed: number, { setSpeedData, playerRef }: UpdateProps) {
    setSpeedData({ defaultSpeed: defaultSpeed, playSpeed: playSpeed });
    playerRef.setPlaybackRate(playSpeed);

    return playSpeed;
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
