import { Status, StatusRef } from "./type";

export class CalcTypeSpeed {
  lineTypeSpeed: number;
  lineTypeRkpm: number;
  totalTypeSpeed: number;
  constructor(status: Status, lineConstantTime: number, statusRef: React.RefObject<StatusRef>) {
    const lineTypeCount = statusRef.current!.lineStatus.lineType;
    const lineLatency = statusRef.current!.lineStatus.latency;
    this.lineTypeSpeed = lineConstantTime ? Math.round((lineTypeCount / lineConstantTime) * 60) : 0;
    this.lineTypeRkpm =
      lineTypeCount == 0
        ? this.lineTypeSpeed
        : Math.round((lineTypeCount / (lineConstantTime - lineLatency)) * 60);

    this.totalTypeSpeed = this.updateTotalTypeSpeed(status, lineConstantTime, statusRef);
  }

  updateTotalTypeSpeed(
    status: Status,
    lineConstantTime: number,
    statusRef: React.RefObject<StatusRef>,
  ) {
    const totalTypeTime = lineConstantTime + statusRef.current!.status.totalTypeTime;
    return totalTypeTime ? Math.round((status.type / totalTypeTime) * 60) : 0;
  }
}
