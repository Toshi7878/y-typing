import { Status, StatusRef, WordType } from "./type";
import { CreateMap } from "./createTypingWord";
import { getRank } from "./keydown";

export class LineResult {
  newStatus: Status;
  newTotalTime: number;

  constructor(
    status: Status,
    statusRef: React.RefObject<StatusRef>,

    lineWord: WordType,
    map: CreateMap,
    lineTime: number,
    totalTypeSpeed: number,
    rankingScores: number[],
  ) {
    this.newStatus = this.updateStatus(
      status,
      statusRef,
      lineWord,
      map,
      totalTypeSpeed,
      rankingScores,
    );
    this.newTotalTime = this.updateTotalTypeTime(lineTime, statusRef.current!.status.totalTypeTime);
  }

  updateStatus(
    status: Status,
    statusRef: React.RefObject<StatusRef>,
    lineWord: WordType,
    map: CreateMap,
    totalTypeSpeed: number,
    rankingScores: number[],
  ) {
    const newStatus = { ...status };

    newStatus.timeBonus = 0;

    if (lineWord.nextChar["k"]) {
      newStatus.kpm = totalTypeSpeed;
      statusRef.current!.status.failureCount++;
      newStatus.line =
        map.lineLength -
        (statusRef.current!.status.completeCount + statusRef.current!.status.failureCount);
      const lostWord = lineWord.nextChar["r"][0] + lineWord.word.map((w) => w["r"][0]).join("");
      newStatus.lost += lostWord.length;
      newStatus.score += newStatus.point;
      newStatus.rank = getRank(rankingScores, newStatus.score);
    }

    newStatus.point = 0;
    return newStatus;
  }

  updateTotalTypeTime(lineTime: number, totalTypeTime: number) {
    return totalTypeTime + lineTime;
  }
}
