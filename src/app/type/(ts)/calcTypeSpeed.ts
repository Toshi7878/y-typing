import { Status, StatusRef } from "./type";

export class CalcTypeSpeed {
  lineTypeSpeed: number;
  totalTypeSpeed: number;
  constructor(status: Status, lineTime: number, statusRef: React.RefObject<StatusRef>) {
    this.lineTypeSpeed = Math.round((statusRef.current!.lineStatus.lineType / lineTime) * 60);
    this.totalTypeSpeed = this.updateTotalTypeSpeed(status, lineTime, statusRef);
  }

  updateTotalTypeSpeed(status: Status, lineTime: number, statusRef: React.RefObject<StatusRef>) {
    const totalTypeTime = lineTime + statusRef.current!.status.totalTypeTime;
    return Math.round((status.type / totalTypeTime) * 60);
  }
}
