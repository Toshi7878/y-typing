import { Status, StatusRef } from "./type";
import { Word } from "../components/(typing-area)/scene/child/PlayingCenter";
import { CreateMap } from "./createTypingWord";

export class LineResult {
  newStatus: Status;
  newTotalTime: number;

  constructor(
    status: Status,
    statusRef: React.RefObject<StatusRef>,

    lineWord: Word,
    map: CreateMap,
    lineTime: number,
  ) {
    this.newStatus = this.updateStatus(status, statusRef, lineWord, map);
    this.newTotalTime = this.updateTotalTypeTime(lineTime, statusRef.current!.status.totalTypeTime);
  }

  updateStatus(
    status: Status,
    statusRef: React.RefObject<StatusRef>,
    lineWord: Word,
    map: CreateMap,
  ) {
    const newStatus = { ...status };

    newStatus.timeBonus = 0;

    if (lineWord.nextChar["k"]) {
      statusRef.current!.status.lineFailureCount++;
      newStatus.line =
        map.lineLength -
        (statusRef.current!.status.lineCompleteCount + statusRef.current!.status.lineFailureCount);
      const lostWord = lineWord.nextChar["r"][0] + lineWord.word.map((w) => w["r"][0]).join("");
      newStatus.lost += lostWord.length;
      newStatus.score += newStatus.point;
    }

    newStatus.point = 0;
    return newStatus;
  }

  updateTotalTypeTime(lineTime: number, totalTypeTime: number) {
    return totalTypeTime + lineTime;
  }
}
