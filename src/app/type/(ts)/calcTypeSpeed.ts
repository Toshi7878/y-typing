import { Status } from "./type";
import { LineStatus } from "../components/(typing-area)/scene/Playing";

export class CalcTypeSpeed {
  lineTypeSpeed: number;
  totalTypeSpeed: number;
  constructor(status: Status, lineStatusRef: LineStatus, lineTime: number, totalTime: number) {
    this.lineTypeSpeed = Math.round((lineStatusRef.type / lineTime) * 60);
    this.totalTypeSpeed = this.updateTotalTypeSpeed(status, lineTime, totalTime);
  }

  updateTotalTypeSpeed(status: Status, lineTime: number, totalTime: number) {
    const totalTypeTime = lineTime + totalTime;
    return Math.round((status.type / totalTypeTime) * 60);
  }
}
