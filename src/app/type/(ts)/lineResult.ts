import { InputModeType, Status, StatusRef, WordType } from "./type";
import { CreateMap } from "./createTypingWord";
import { getRank } from "./keydown";

export class LineResult {
  newStatus: Status;
  lostW: string;
  lostLen: number;

  constructor(
    status: Status,
    statusRef: React.RefObject<StatusRef>,

    lineWord: WordType,
    inputMode: InputModeType,
    map: CreateMap,
    totalTypeSpeed: number,
    rankingScores: number[],
  ) {
    this.lostLen = lineWord.nextChar["k"]
      ? lineWord.nextChar["p"] / 10 + lineWord.word.map((w) => w["r"][0]).join("").length
      : 0;

    this.newStatus = this.updateStatus(
      status,
      statusRef,
      lineWord,
      this.lostLen,
      map,
      totalTypeSpeed,
      rankingScores,
    );

    this.lostW = this.setLostWord(lineWord, inputMode);
  }

  updateStatus(
    status: Status,
    statusRef: React.RefObject<StatusRef>,
    lineWord: WordType,
    lostLen: number,
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
      newStatus.lost += lostLen;
      newStatus.score += newStatus.point;
      newStatus.rank = getRank(rankingScores, newStatus.score);
    }

    newStatus.point = 0;
    return newStatus;
  }

  setLostWord(lineWord: WordType, inputMode: InputModeType) {
    if (lineWord.nextChar["k"]) {
      const romaLostWord = lineWord.nextChar["r"][0] + lineWord.word.map((w) => w["r"][0]).join("");
      const kanaLostWord = lineWord.nextChar["k"] + lineWord.word.map((w) => w["k"]).join("");

      return inputMode === "roma" ? romaLostWord : kanaLostWord;
    } else {
      return "";
    }
  }
}
