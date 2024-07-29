import { CreateMap } from "./createTypingWord";
import { getRank } from "./keydown";
import { LineResultObj, Status } from "./type";

export const updateReplayStatus = (
  count: number,
  lineResult: LineResultObj[],
  map: CreateMap,
  rankingScores: number[],
) => {
  const newStatus: Status = {
    score: 0,
    point: 0,
    timeBonus: 0,
    type: 0,
    miss: 0,
    lost: 0,
    kpm: 0,
    rank: 0,
    line: map.lineLength,
  };

  if (0 >= count) {
    return newStatus;
  }

  for (let i = 0; i <= count - 1; i++) {
    newStatus.score += (lineResult[i].status?.p ?? 0) + (lineResult[i].status?.tBonus ?? 0);
    newStatus.type += lineResult[i].status?.lType ?? 0;
    newStatus.miss += lineResult[i].status?.lMiss ?? 0;
    newStatus.lost += lineResult[i].status?.lLost ?? 0;
    newStatus.line -= lineResult[i].status?.lType != null ? 1 : 0;
  }
  const totalTypeTime = lineResult[count - 1].status?.tTime;
  newStatus.kpm = totalTypeTime ? Math.round((newStatus.type / totalTypeTime!) * 60) : 0;
  newStatus.rank = getRank(rankingScores, newStatus.score);

  return newStatus;
};
