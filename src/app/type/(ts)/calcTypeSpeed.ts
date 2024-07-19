import { Status, StatusRef } from "./type";

export class CalcTypeSpeed {
  lineTypeSpeed: number;
  lineTypeRkpm: number;
  totalTypeSpeed: number;
  constructor(status: Status, lineTime: number, statusRef: React.RefObject<StatusRef>) {
    const lineTypeCount = statusRef.current!.lineStatus.lineType;
    const lineLatency = statusRef.current!.lineStatus.latency;
    this.lineTypeSpeed = lineTime ? Math.round((lineTypeCount / lineTime) * 60) : 0;
    this.lineTypeRkpm =
      lineTypeCount == 0
        ? this.lineTypeSpeed
        : Math.round((lineTypeCount / (lineTime - lineLatency)) * 60);

    this.totalTypeSpeed = this.updateTotalTypeSpeed(status, lineTime, statusRef);
  }

  updateTotalTypeSpeed(status: Status, lineTime: number, statusRef: React.RefObject<StatusRef>) {
    const totalTypeTime = lineTime + statusRef.current!.status.totalTypeTime;
    return totalTypeTime ? Math.round((status.type / totalTypeTime) * 60) : 0;
  }
}
