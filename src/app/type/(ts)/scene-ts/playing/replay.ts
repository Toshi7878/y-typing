import { TabStatusRef } from "../../../components/(tab)/tab/TabStatus";
import { PlayingComboRef } from "../../../components/(typing-area)/scene/playing-child/child/PlayingCombo";
import { PlayingLineTimeRef } from "../../../components/(typing-area)/scene/playing-child/child/PlayingLineTime";
import { PlayingCenterRef } from "../../../components/(typing-area)/scene/playing-child/PlayingCenter";
import { CalcTypeSpeed } from "./calcTypeSpeed";
import { CreateMap } from "../ready/createTypingWord";
import { CharsType, getRank, KanaInput, Miss, RomaInput, Success } from "./keydown/typing";
import {
  GameStateRef,
  InputModeType,
  LineResultData,
  PlayingRef,
  SceneType,
  Status,
  StatusRef,
  YTStateRef,
} from "../../type";

export const updateReplayStatus = (
  count: number,
  lineResults: LineResultData[],
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
    newStatus.score += (lineResults[i].status?.p ?? 0) + (lineResults[i].status?.tBonus ?? 0);
    newStatus.type += lineResults[i].status?.lType ?? 0;
    newStatus.miss += lineResults[i].status?.lMiss ?? 0;
    newStatus.lost += lineResults[i].status?.lLost ?? 0;
    newStatus.line -= lineResults[i].status?.lType != null ? 1 : 0;
  }
  const totalTypeTime = lineResults[count - 1].status?.tTime;
  newStatus.kpm = totalTypeTime ? Math.round((newStatus.type / totalTypeTime!) * 60) : 0;
  newStatus.rank = getRank(rankingScores, newStatus.score);

  return newStatus;
};

export const replay = (
  count: number,
  lineResults: LineResultData[],
  gameStateRef: React.RefObject<GameStateRef>,
  playingRef: React.RefObject<PlayingRef>,
  map: CreateMap,
  lineTime: number,
  playingCenterRef: React.RefObject<PlayingCenterRef>,
  ytStateRef: React.RefObject<YTStateRef>,
  statusRef: React.RefObject<StatusRef>,
  playingComboRef: React.RefObject<PlayingComboRef>,
  tabStatusRef: React.RefObject<TabStatusRef>,
  playingLineTimeRef: React.RefObject<PlayingLineTimeRef>,
  inputMode: string,
  lineConstantTime: number,
  rankingScores: number[],
  scene: SceneType,
) => {
  const lineResult: LineResultData = lineResults[count - 1];
  const typeResults = lineResult.typeResult;

  if (typeResults.length === 0) {
    return;
  }
  const keyCount = gameStateRef.current!.replay.replayKeyCount!;

  const typeData = typeResults[keyCount];

  if (!typeData) {
    return;
  }

  const keyTime = typeData.t;

  if (lineConstantTime >= keyTime) {
    const key = typeData.c;
    const isSuccess = typeData.is;
    const option = typeData.op;
    if (key) {
      const lineWord = playingCenterRef.current!.getLineWord();
      const chars: CharsType = {
        keys: [key],
        key: key,
      };
      const status = tabStatusRef.current!.getStatus();

      if (isSuccess) {
        console.log("update replay Success");

        const result =
          inputMode === "roma"
            ? new RomaInput({ chars, lineWord })
            : new KanaInput({ chars, lineWord });
        const currentLine = map!.mapData[count];
        const remainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;

        if (result.newLineWord.nextChar["k"]) {
          const typeSpeed = new CalcTypeSpeed("keydown", status!, lineConstantTime, statusRef);
          const success = new Success(
            status,
            statusRef,
            result.successKey,
            lineConstantTime,
            playingComboRef,
            inputMode as InputModeType,
            result.updatePoint,
            result.newLineWord,
            map!,
            typeSpeed.totalKpm,
            remainTime,
            rankingScores,
            scene,
          );

          tabStatusRef.current!.setStatus(success.newStatus);
          playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
        } else {
          const newStatus = updateReplayStatus(count, lineResults, map, rankingScores);
          newStatus.point = lineResult.status!.p as number;
          newStatus.timeBonus = lineResult.status!.tBonus as number;

          tabStatusRef.current!.setStatus(newStatus);
          playingComboRef.current?.setCombo(lineResult.status!.combo as number);
          playingLineTimeRef.current?.setLineKpm(lineResult.status!.lKpm as number);
          statusRef.current!.status.totalTypeTime = lineResult.status!.tTime;
        }

        playingCenterRef.current!.setLineWord(result.newLineWord);
      } else {
        console.log("update replay failed");
        const miss = new Miss(status, statusRef, key, playingComboRef, lineConstantTime);
        tabStatusRef.current!.setStatus(miss.newStatus);
      }
    } else if (option) {
      console.log("update replay option");

      switch (option) {
        case "roma":
          playingRef.current?.inputModeChange("roma");
          break;
        case "kana":
          playingRef.current?.inputModeChange("kana");
          break;
        case "speedChange":
          playingRef.current!.realtimeSpeedChange();
          break;
      }
    }

    gameStateRef.current!.replay.replayKeyCount++;
  }
};

export const lineReplayUpdate = (
  lineResults: LineResultData[],
  gameStateRef: React.RefObject<GameStateRef>,
  playingRef: React.RefObject<PlayingRef>,
  newCount: number,
) => {
  const lineResult = lineResults[newCount];
  const lineInputMode = lineResult.status!.mode;
  const speed = lineResult.status!.sp;

  playingRef.current?.inputModeChange(lineInputMode);
  playingRef.current?.setRealTimeSpeed(speed);

  gameStateRef.current!.replay.replayKeyCount = 0;
};
