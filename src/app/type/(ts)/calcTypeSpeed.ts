import { LineStatus, Status } from "./type";

export class CalcTypeSpeed {
  lineTypeSpeed: number;
  totalTypeSpeed: number;
  constructor(status: Status, lineStatusRef: LineStatus, lineTime: number, totalTime: number) {
    this.lineTypeSpeed = Math.round((lineStatusRef.type / lineTime) * 60);
    this.totalTypeSpeed = this.updateTotalTypeSpeed(status, lineTime, totalTime);
  }

  updateTotalTypeSpeed(status: Status, lineTime: number, totalTime: number) {
    const totalTypeTime = lineTime + totalTime;
    return Math.round((status.display.type / totalTypeTime) * 60);
  }
}
