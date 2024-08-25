import { Action, Dispatch } from "@reduxjs/toolkit";
import { RefObject } from "react";
import { setSpeed } from "../../redux/ytStateSlice";

interface UpdateProps {
  dispatch: Dispatch<Action>;
  playerRef: any;
}

export class YTSpeedController {
  constructor(changeName: string, { dispatch, playerRef }: UpdateProps) {
    if (changeName === "up") {
      this.speedUp({ dispatch, playerRef });
    } else if (changeName === "down") {
      this.speedDown({ dispatch, playerRef });
    }
  }

  speedUp({ dispatch, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed < 2) {
      const NEW_SPEED = currentSpeed + 0.25;
      this.speedChange(NEW_SPEED, { dispatch, playerRef });
    }
  }

  speedDown({ dispatch, playerRef }: UpdateProps) {
    const currentSpeed = playerRef.getPlaybackRate();

    if (currentSpeed > 0.25) {
      const NEW_SPEED = currentSpeed - 0.25;
      this.speedChange(NEW_SPEED, { dispatch, playerRef });
    }
  }
  speedChange(NEW_SPEED: number, { dispatch, playerRef }: UpdateProps) {
    dispatch(setSpeed(NEW_SPEED));
    playerRef.setPlaybackRate(NEW_SPEED);
  }
}
