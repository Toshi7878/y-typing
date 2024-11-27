import { useParams } from "next/navigation";
import { actions } from "../ts/scene-ts/end/send-result-server-actions";
import { LineResultData, Status } from "../ts/type";
import { useLineResultsAtom } from "../type-atoms/gameRenderAtoms";
import { useRefs } from "../type-contexts/refsProvider";

export const useSendResult = () => {
  const { id: mapId } = useParams();
  const { statusRef, tabStatusRef } = useRefs();
  const lineResults: LineResultData[] = useLineResultsAtom();
  const minSp = lineResults.reduce((min, result) => {
    if (result.status!.tTime !== 0) {
      return Math.min(min, result.status!.sp);
    }
    return min;
  }, Infinity);

  return async (): Promise<ReturnType<typeof actions>> => {
    const totalTypeTime = statusRef.current!.status.totalTypeTime;
    const rkpmTime = totalTypeTime - statusRef.current!.status.totalLatency;
    const kanaToRomaConvertCount = statusRef.current!.status.kanaToRomaConvertCount;
    const status: Status = tabStatusRef.current!.getStatus();

    const sendStatus = {
      score: status.score,
      romaType: statusRef.current!.status.romaType,
      kanaType: statusRef.current!.status.kanaType,
      flickType: statusRef.current!.status.flickType,
      miss: status.miss,
      lost: status.lost,
      rkpm: Math.round((status.type / rkpmTime) * 60),
      maxCombo: statusRef.current!.status.maxCombo,
      kpm: status.kpm,
      romaKpm: Math.round((kanaToRomaConvertCount / totalTypeTime) * 60),
      defaultSpeed: minSp,
      clearRate: +statusRef.current!.status.clearRate.toFixed(1),
    };
    const sendData = {
      mapId: Number(mapId),
      status: sendStatus,
    };

    const result = await actions(sendData, lineResults);

    return result;
  };
};
