import { Action, Dispatch } from "@reduxjs/toolkit";
import { setSpeed } from "../../(redux)/ytStateSlice";

interface UpdateProps {
  dispatch: Dispatch<Action>;
  player: any;
}

export class YTSpeedController {
  constructor(changeName: string, { dispatch, player }: UpdateProps) {
    if (changeName === "up") {
      this.speedUp({ dispatch, player });
    } else if (changeName === "down") {
      this.speedDown({ dispatch, player });
    }
  }

  speedUp({ dispatch, player }: UpdateProps) {
    const currentSpeed = player.getPlaybackRate();

    if (currentSpeed < 2) {
      const NEW_SPEED = currentSpeed + 0.25;
      this.speedChange(NEW_SPEED, { dispatch, player });
    }
  }

  speedDown({ dispatch, player }: UpdateProps) {
    const currentSpeed = player.getPlaybackRate();

    if (currentSpeed > 0.25) {
      const NEW_SPEED = currentSpeed - 0.25;
      this.speedChange(NEW_SPEED, { dispatch, player });
    }
  }
  speedChange(NEW_SPEED: number, { dispatch, player }: UpdateProps) {
    dispatch(setSpeed(NEW_SPEED));
    player.setPlaybackRate(NEW_SPEED);
  }
}
