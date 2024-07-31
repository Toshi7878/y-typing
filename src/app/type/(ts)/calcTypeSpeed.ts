import { Status, StatusRef } from "./type";

export class CalcTypeSpeed {
  lineKpm: number;
  lineRkpm: number;
  totalKpm: number;
  constructor(
    updateText: "keydown" | "timer" = "timer",
    status: Status,
    lineConstantTime: number,
    statusRef: React.RefObject<StatusRef>,
  ) {
    const lineTypeCount =
      updateText === "keydown"
        ? statusRef.current!.lineStatus.lineType + 1
        : statusRef.current!.lineStatus.lineType;
    const totalTypeCount = updateText === "keydown" ? status.type + 1 : status.type;
    this.lineKpm = lineConstantTime ? Math.round((lineTypeCount / lineConstantTime) * 60) : 0;

    const lineLatency = statusRef.current!.lineStatus.latency;
    const rkpmTime = lineConstantTime - lineLatency;
    this.lineRkpm = lineTypeCount != 0 ? Math.round((lineTypeCount / rkpmTime) * 60) : this.lineKpm;
    this.totalKpm = this.updateTotalKpm(totalTypeCount, lineConstantTime, statusRef);
  }

  private updateTotalKpm(
    totalTypeCount: number,
    lineConstantTime: number,
    statusRef: React.RefObject<StatusRef>,
  ) {
    const totalTypeTime = lineConstantTime + statusRef.current!.status.totalTypeTime;
    return totalTypeTime ? Math.round((totalTypeCount / totalTypeTime) * 60) : 0;
  }
}
