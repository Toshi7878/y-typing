import { TabStatusRef } from "../components/(tab)/tab/TabStatus";
import { PlayingComboRef } from "../components/(typing-area)/scene/child/child/PlayingCombo";
import { PlayingLineTimeRef } from "../components/(typing-area)/scene/child/child/PlayingLineTime";
import { PlayingCenterRef } from "../components/(typing-area)/scene/child/PlayingCenter";
import { CalcTypeSpeed } from "./calcTypeSpeed";
import { CreateMap } from "./createTypingWord";
import { CharsType, getRank, KanaInput, Miss, RomaInput, Success } from "./keydown";
import {
  GameStateRef,
  InputModeType,
  LineResultData,
  PlayingRef,
  SceneType,
  Status,
  StatusRef,
  YTStateRef,
} from "./type";

export const updateReplayStatus = (
  count: number,
  lineResult: LineResultData[],
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

export const replay = (
  count: number,
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
  const lineResult: LineResultData = gameStateRef.current!.replay.replayData[count - 1];
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

  if (lineTime >= keyTime) {
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
        const currentLine = map!.words[count];
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
            lineTime,
            typeSpeed.totalKpm,
            remainTime,
            rankingScores,
            scene,
          );

          tabStatusRef.current!.setStatus(success.newStatus);
          playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
        } else {
          const newStatus = updateReplayStatus(
            count,
            gameStateRef.current!.replay.replayData,
            map,
            rankingScores,
          );
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
        const miss = new Miss(status, statusRef, key, playingComboRef, lineTime);
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
  gameStateRef: React.RefObject<GameStateRef>,
  playingRef: React.RefObject<PlayingRef>,
  count: number,
) => {
  const lineResult = gameStateRef.current!.replay.replayData[count - 1];
  const lineInputMode = lineResult.status.mode;
  const speed = lineResult.status.sp;

  playingRef.current?.inputModeChange(lineInputMode);
  playingRef.current?.setRealTimeSpeed(speed);

  gameStateRef.current!.replay.replayKeyCount = 0;
};
