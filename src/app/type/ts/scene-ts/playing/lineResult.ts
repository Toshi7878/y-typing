import { InputModeType, SceneType, Status, StatusRef, WordType } from "../../type";
import { CreateMap } from "../ready/createTypingWord";
import { getRank } from "./keydown/typing";

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
    scene: SceneType,
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
      scene,
    );

    this.lostW = this.setLostWord(lineWord, inputMode);
  }

  private updateStatus(
    status: Status,
    statusRef: React.RefObject<StatusRef>,
    lineWord: WordType,
    lostLen: number,
    map: CreateMap,
    totalTypeSpeed: number,
    rankingScores: number[],
    scene: SceneType,
  ) {
    const newStatus = { ...status };
    if (scene === "playing" && statusRef.current) {
      statusRef.current.status.kanaToRomaConvertCount += lineWord.correct.r.length;
    }

    newStatus.timeBonus = 0;

    if (lineWord.nextChar["k"]) {
      newStatus.kpm = totalTypeSpeed;
      statusRef.current!.status.failureCount++;
      newStatus.line =
        map.lineLength -
        (statusRef.current!.status.completeCount + statusRef.current!.status.failureCount);
      newStatus.lost += lostLen;
      statusRef.current!.status.clearRate -= map.keyRate * lostLen;
      newStatus.score += newStatus.point;
      newStatus.rank = getRank(rankingScores, newStatus.score);
    }

    console.log(
      "🚀 ~ LineResult ~ statusRef.current!.status.clearRate:",
      statusRef.current!.status.clearRate,
    );

    newStatus.point = 0;
    return newStatus;
  }

  private setLostWord(lineWord: WordType, inputMode: InputModeType) {
    if (lineWord.nextChar["k"]) {
      const romaLostWord = lineWord.nextChar["r"][0] + lineWord.word.map((w) => w["r"][0]).join("");
      const kanaLostWord = lineWord.nextChar["k"] + lineWord.word.map((w) => w["k"]).join("");

      return inputMode === "roma" ? romaLostWord : kanaLostWord;
    } else {
      return "";
    }
  }
}
