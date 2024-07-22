import { Dispatch } from "react";
import { Speed } from "./type";

interface UpdateProps {
  speedData?: Speed;
  setSpeedData: Dispatch<Speed>;
  playerRef: any;
}

export class YTSpeedController {
  constructor(changeName: string, { speedData, setSpeedData, playerRef }: UpdateProps) {
    if (changeName === "up") {
      this.speedUp({ setSpeedData, playerRef });
    } else if (changeName === "down") {
      this.speedDown({ setSpeedData, playerRef });
    } else if (changeName === "change") {
      this.realtimeChange({ speedData, setSpeedData, playerRef });
    }
  }

  speedUp({ setSpeedData, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed < 2) {
      const NEW_SPEED = currentSpeed + 0.25;
      this.speedChange(NEW_SPEED, { setSpeedData, playerRef });
    }
  }

  speedDown({ setSpeedData, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed > 0.25) {
      const NEW_SPEED = currentSpeed - 0.25;
      this.speedChange(NEW_SPEED, { setSpeedData, playerRef });
    }
  }
  speedChange(NEW_SPEED: number, { setSpeedData, playerRef }: UpdateProps) {
    setSpeedData({ defaultSpeed: NEW_SPEED, playSpeed: NEW_SPEED });
    playerRef.setPlaybackRate(NEW_SPEED);
  }

  realtimeChange({ speedData, setSpeedData, playerRef }: UpdateProps) {
    const playSpeed = speedData?.defaultSpeed!;
    const realtimeSpeed = speedData?.playSpeed!;
    const newRealTimeSpeed = realtimeSpeed + 0.25 <= 2 ? realtimeSpeed + 0.25 : playSpeed;

    setSpeedData({
      ...speedData!,
      playSpeed: newRealTimeSpeed,
    });

    playerRef.setPlaybackRate(newRealTimeSpeed);
  }
}
