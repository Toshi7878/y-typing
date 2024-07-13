import { Status } from "./type";
import { Word } from "../components/(typing-area)/scene/child/PlayingCenter";
import { CreateMap } from "./createTypingWord";

export class LineResult {
  newStatus: Status;
  newTotalTime: number;

  constructor(
    status: Status,
    lineWord: Word,
    map: CreateMap,
    lineTime: number,
    totalTypeTimeRef: React.RefObject<number>,
  ) {
    this.newStatus = this.updateStatus(status, lineWord, map);
    this.newTotalTime = this.updateTotalTypeTime(lineTime, totalTypeTimeRef);
  }

  updateStatus(status: Status, lineWord: Word, map: CreateMap) {
    const newStatus = { ...status };

    newStatus.timeBonus = 0;
    if (lineWord.nextChar["k"]) {
      newStatus.lineFailureCount++;
      newStatus.line = map.lineLength - (newStatus.lineCompleteCount + newStatus.lineFailureCount);
      const lostWord = lineWord.nextChar["r"][0] + lineWord.word.map((w) => w["r"][0]).join("");
      newStatus.lost += lostWord.length;
      newStatus.score += newStatus.point;
    }

    newStatus.point = 0;
    return newStatus;
  }

  updateTotalTypeTime(lineTime: number, totalTypeTimeRef: React.RefObject<number>) {
    return totalTypeTimeRef.current! + lineTime;
  }
}
