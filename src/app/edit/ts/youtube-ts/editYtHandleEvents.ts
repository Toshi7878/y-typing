import { YouTubeSpeed } from "@/types";
import { Dispatch } from "react";

interface UpdateProps {
  setSpeed: Dispatch<YouTubeSpeed>;
  playerRef: any;
}

export class YTSpeedController {
  constructor(changeName: string, { setSpeed, playerRef }: UpdateProps) {
    if (changeName === "up") {
      this.speedUp({ setSpeed, playerRef });
    } else if (changeName === "down") {
      this.speedDown({ setSpeed, playerRef });
    }
  }

  speedUp({ setSpeed, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed < 2) {
      const NEW_SPEED = currentSpeed + 0.25;
      this.speedChange(NEW_SPEED as YouTubeSpeed, { setSpeed, playerRef });
    }
  }

  speedDown({ setSpeed, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed > 0.25) {
      const NEW_SPEED = currentSpeed - 0.25;
      this.speedChange(NEW_SPEED as YouTubeSpeed, { setSpeed, playerRef });
    }
  }
  speedChange(NEW_SPEED: YouTubeSpeed, { setSpeed, playerRef }: UpdateProps) {
    setSpeed(NEW_SPEED);
    playerRef.setPlaybackRate(NEW_SPEED);
  }
}
