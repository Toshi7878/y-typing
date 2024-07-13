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
    count: number,
  ) {
    this.newStatus = this.updateStatus(status, lineWord, map, count);
    this.newTotalTime = this.updateTotalTypeTime(lineTime, totalTypeTimeRef);
  }

  updateStatus(status: Status, lineWord: Word, map: CreateMap, count: number) {
    const newStatus = { ...status };

    const word = count - 1 > 0 ? map.typePattern[count - 1].map((w) => w["r"][0]).join("") : "";

    const lostPoint = (word.length * 5 - status.lineTypePoint) / 5;

    newStatus.acc -= Number(map.getScorePerChar) / lostPoint;
    newStatus.display.timeBonus = 0;

    console.log(lostPoint);

    newStatus.lineTypePoint = 0;
    newStatus.lineMissPoint = 0;
    if (lineWord.nextChar["k"]) {
      newStatus.lineFailureCount++;
      newStatus.display.line =
        map.lineLength - (newStatus.lineCompleteCount + newStatus.lineFailureCount);
      const lostWord = lineWord.nextChar["r"][0] + lineWord.word.map((w) => w["r"][0]).join("");
      newStatus.display.lost += lostWord.length;
      newStatus.display.score += newStatus.display.point;
    }

    newStatus.display.point = 0;
    return newStatus;
  }

  updateTotalTypeTime(lineTime: number, totalTypeTimeRef: React.RefObject<number>) {
    return totalTypeTimeRef.current! + lineTime;
  }
}
