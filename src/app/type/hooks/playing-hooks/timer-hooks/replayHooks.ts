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
  inputModeAtom,
  lineResultsAtom,
  lineWordAtom,
  rankingScoresAtom,
  useMapAtom,
  useSetComboAtom,
  useSetDisplayLineKpmAtom,
  useSetLineWordAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { useInputModeChange } from "@/app/type/hooks/playing-hooks/useInputModeChange";
import { useSoundEffect } from "../useSoundEffect";
import { useVideoSpeedChange } from "@/app/type/hooks/useVideoSpeedChange";
import { useGetTime } from "../../useGetTime";
import { useCalcTypeSpeed } from "@/app/type/ts/scene-ts/playing/calcTypeSpeed";
import { useStore } from "jotai";

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
  constantLineTime: number;
  typeData: TypeResult;
  lineResult: LineResultData;
}

const useKeyReplay = () => {
  const { statusRef, tabStatusRef } = useRefs();

  const map = useMapAtom() as CreateMap;
  const typeAtomStore = useStore();

  const setLineWord = useSetLineWordAtom();
  const setDisplayLineKpm = useSetDisplayLineKpmAtom();

  const inputModeChange = useInputModeChange();
  const { playingSpeedChange } = useVideoSpeedChange();
  const { getConstantRemainLineTime } = useGetTime();

  const { updateSuccessStatus, updateSuccessStatusRefs } = useTypeSuccess();
  const { updateMissStatus, updateMissRefStatus } = useTypeMiss();
  const { triggerTypingSound, triggerMissSound } = useSoundEffect();
  const calcTypeSpeed = useCalcTypeSpeed();
  const setCombo = useSetComboAtom();

  return ({ constantLineTime, lineResult, typeData }: UseKeyReplayProps) => {
    const key = typeData.c;
    const isSuccess = typeData.is;
    const option = typeData.op;
    const count = statusRef.current!.status.count;

    if (key) {
      const chars: CharsType = {
        keys: [key],
        key: key,
        code: `Key${key.toUpperCase()}`,
      };
      const status = tabStatusRef.current!.getStatus();

      if (isSuccess) {
        const inputMode = typeAtomStore.get(inputModeAtom);
        const lineWord = typeAtomStore.get(lineWordAtom);
        const result =
          inputMode === "roma"
            ? new RomaInput({ chars, lineWord })
            : new KanaInput({ chars, lineWord });
        const lineRemainConstantTime = getConstantRemainLineTime(constantLineTime);

        const lineResults = typeAtomStore.get(lineResultsAtom);

        if (result.newLineWord.nextChar["k"]) {
          const typeSpeed = calcTypeSpeed({
            updateType: "keydown",
            constantLineTime,
            totalTypeCount: status.type,
          });

          updateSuccessStatusRefs({
            constantLineTime,
            newLineWord: result.newLineWord,
            successKey: result.successKey,
            newLineKpm: typeSpeed.lineKpm,
          });

          const newStatus = updateSuccessStatus({
            newLineWord: result.newLineWord,
            lineRemainConstantTime,
            updatePoint: result.updatePoint,
            totalKpm: typeSpeed.totalKpm,
            status,
          });

          triggerTypingSound({ isLineCompleted: false });

          tabStatusRef.current!.setStatus(newStatus);
          setDisplayLineKpm(typeSpeed.lineKpm);
        } else {
          const rankingScores = typeAtomStore.get(rankingScoresAtom);

          const newStatusReplay = updateReplayStatus(count, lineResults, map, rankingScores);
          newStatusReplay.point = lineResult.status!.p as number;
          newStatusReplay.timeBonus = lineResult.status!.tBonus as number;

          tabStatusRef.current!.setStatus(newStatusReplay);
          setCombo(lineResult.status!.combo as number);
          setDisplayLineKpm(lineResult.status!.lKpm as number);
          statusRef.current!.status.totalTypeTime = lineResult.status!.tTime;
          triggerTypingSound({ isLineCompleted: true });
        }

        setLineWord(result.newLineWord);
      } else {
        const newStatus = updateMissStatus(status);
        updateMissRefStatus({ constantLineTime, failKey: key });
        tabStatusRef.current!.setStatus(newStatus);

        triggerMissSound();
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
          playingSpeedChange();
          break;
      }
    }
  };
};

export const useReplay = () => {
  const { gameStateRef, statusRef } = useRefs();
  const keyReplay = useKeyReplay();
  const typeAtomStore = useStore();

  return ({ constantLineTime }: { constantLineTime: number }) => {
    const count = statusRef.current!.status.count;
    const lineResults = typeAtomStore.get(lineResultsAtom);

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

    if (constantLineTime >= keyTime) {
      keyReplay({ constantLineTime: constantLineTime, lineResult, typeData });
      gameStateRef.current!.replay.replayKeyCount++;
    }
  };
};

export const useLineReplayUpdate = () => {
  const { gameStateRef } = useRefs();
  const typeAtomStore = useStore();

  const { playingSpeedChange } = useVideoSpeedChange();
  const inputModeChange = useInputModeChange();

  return (newCount: number) => {
    const lineResults = typeAtomStore.get(lineResultsAtom);

    const lineResult = lineResults[newCount];
    const lineInputMode = lineResult.status!.mode;
    const speed = lineResult.status!.sp;

    inputModeChange(lineInputMode);
    playingSpeedChange("set", speed);

    gameStateRef.current!.replay.replayKeyCount = 0;
  };
};
