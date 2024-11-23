import { CalcTypeSpeed } from "../../../ts/scene-ts/playing/calcTypeSpeed";
import { CreateMap } from "../../../ts/scene-ts/ready/createTypingWord";
import {
  CharsType,
  getRank,
  KanaInput,
  RomaInput,
  useTypeMiss,
  useTypeSuccess,
} from "../../../ts/scene-ts/playing/keydown/typing";
import { LineResultData, Status, TypeResult } from "../../../ts/type";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useMapAtom,
  useRankingScoresAtom,
  useUserOptionsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import {
  useRealTimeSpeedChange,
  useSetRealTimeSpeed,
} from "@/app/type/hooks/playing-hooks/useSpeedChange";
import { useInputModeChange } from "@/app/type/hooks/playing-hooks/useInputModeChange";
import { useSoundEffect } from "../useSoundEffect";

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

interface UseKeyReplayProps {
  lineConstantTime: number;
  typeData: TypeResult;
  lineResult: LineResultData;
}

const useKeyReplay = () => {
  const {
    statusRef,
    playingTypingWordsRef,
    tabStatusRef,
    playingComboRef,
    ytStateRef,
    playingLineTimeRef,
  } = useRefs();

  const map = useMapAtom() as CreateMap;
  const inputMode = useInputModeAtom();
  const rankingScores = useRankingScoresAtom();
  const lineResults = useLineResultsAtom();
  const userOptionsAtom = useUserOptionsAtom();

  const inputModeChange = useInputModeChange();
  const realTimeSpeedChange = useRealTimeSpeedChange();
  const { updateSuccessStatus, updateSuccessStatusRefs } = useTypeSuccess();
  const { updateMissStatus, updateMissRefStatus } = useTypeMiss();
  const { clearTypeSoundPlay, typeSoundPlay, missSoundPlay } = useSoundEffect();

  return ({ lineConstantTime, lineResult, typeData }: UseKeyReplayProps) => {
    const key = typeData.c;
    const isSuccess = typeData.is;
    const option = typeData.op;
    const count = statusRef.current!.status.count;

    if (key) {
      const lineWord = playingTypingWordsRef.current!.getLineWord();
      const chars: CharsType = {
        keys: [key],
        key: key,
        code: `Key${key.toUpperCase()}`,
      };
      const status = tabStatusRef.current!.getStatus();

      if (isSuccess) {
        const result =
          inputMode === "roma"
            ? new RomaInput({ chars, lineWord })
            : new KanaInput({ chars, lineWord });
        const currentLine = map!.mapData[count];
        const lineRemainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;

        if (result.newLineWord.nextChar["k"]) {
          const typeSpeed = new CalcTypeSpeed("keydown", status!, lineConstantTime, statusRef);

          updateSuccessStatusRefs({
            lineConstantTime,
            newLineWord: result.newLineWord,
            successKey: result.successKey,
            newLineKpm: typeSpeed.lineKpm,
          });

          const newStatus = updateSuccessStatus({
            newLineWord: result.newLineWord,
            lineRemainTime,
            updatePoint: result.updatePoint,
            totalKpm: typeSpeed.totalKpm,
            status,
          });

          if (userOptionsAtom.typeSound) {
            typeSoundPlay();
          }

          tabStatusRef.current!.setStatus(newStatus);
          playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
        } else {
          const newStatusReplay = updateReplayStatus(count, lineResults, map, rankingScores);
          newStatusReplay.point = lineResult.status!.p as number;
          newStatusReplay.timeBonus = lineResult.status!.tBonus as number;

          tabStatusRef.current!.setStatus(newStatusReplay);
          playingComboRef.current?.setCombo(lineResult.status!.combo as number);
          playingLineTimeRef.current?.setLineKpm(lineResult.status!.lKpm as number);
          statusRef.current!.status.totalTypeTime = lineResult.status!.tTime;
          if (userOptionsAtom.lineClearSound) {
            clearTypeSoundPlay();
          } else if (userOptionsAtom.typeSound) {
            typeSoundPlay();
          }
        }

        playingTypingWordsRef.current!.setLineWord(result.newLineWord);
      } else {
        const newStatus = updateMissStatus(status);
        updateMissRefStatus({ lineConstantTime, failKey: key });
        tabStatusRef.current!.setStatus(newStatus);

        if (userOptionsAtom.missSound) {
          missSoundPlay();
        }
      }
    } else if (option) {
      switch (option) {
        case "roma":
          inputModeChange("roma");
          break;
        case "kana":
          inputModeChange("kana");
          break;
        case "speedChange":
          realTimeSpeedChange();
          break;
      }
    }
  };
};

export const useReplay = () => {
  const { gameStateRef, statusRef } = useRefs();
  const lineResults = useLineResultsAtom();
  const keyReplay = useKeyReplay();
  return ({ lineConstantTime }: { lineConstantTime: number }) => {
    const count = statusRef.current!.status.count;
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
      keyReplay({ lineConstantTime, lineResult, typeData });
      gameStateRef.current!.replay.replayKeyCount++;
    }
  };
};

export const useLineReplayUpdate = () => {
  const { gameStateRef } = useRefs();
  const lineResults = useLineResultsAtom();
  const setRealTimeSpeed = useSetRealTimeSpeed();
  const inputModeChange = useInputModeChange();

  return (newCount: number) => {
    const lineResult = lineResults[newCount];
    const lineInputMode = lineResult.status!.mode;
    const speed = lineResult.status!.sp;

    inputModeChange(lineInputMode);
    setRealTimeSpeed(speed);

    gameStateRef.current!.replay.replayKeyCount = 0;
  };
};
