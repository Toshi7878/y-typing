import { Status, StatusRef } from "./type";

export class CalcTypeSpeed {
  lineKpm: number;
  lineRkpm: number;
  totalKpm: number;
  constructor(status: Status, lineConstantTime: number, statusRef: React.RefObject<StatusRef>) {
    const lineTypeCount = statusRef.current!.lineStatus.lineType;
    this.lineKpm = lineConstantTime ? Math.round((lineTypeCount / lineConstantTime) * 60) : 0;

    const lineLatency = statusRef.current!.lineStatus.latency;
    const rkpmTime = lineConstantTime - lineLatency;
    this.lineRkpm = lineTypeCount != 0 ? Math.round((lineTypeCount / rkpmTime) * 60) : this.lineKpm;

    this.totalKpm = this.updateTotalTypeSpeed(status, lineConstantTime, statusRef);
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
