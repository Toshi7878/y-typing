import { useRefs } from "@/app/type/type-contexts/refsProvider";

export const useCalcTypeSpeed = () => {
  const { statusRef } = useRefs();

  const calcLineKpm = ({ constantLineTime, newLineTypeCount }) => {
    const lineKpm = constantLineTime ? Math.round((newLineTypeCount / constantLineTime) * 60) : 0;
    return lineKpm;
  };

  const calcLineRkpm = ({ lineKpm, newLineTypeCount, rkpmTime }) => {
    const lineRkpm =
      newLineTypeCount != 0 ? Math.round((newLineTypeCount / rkpmTime) * 60) : lineKpm;
    return lineRkpm;
  };

  const calcTotalKpm = ({ newTotalTypeCount, totalTypeTime }) => {
    return totalTypeTime ? Math.round((newTotalTypeCount / totalTypeTime) * 60) : 0;
  };

  return ({
    updateType = "timer",
    constantLineTime,
    totalTypeCount,
  }: {
    updateType: "keydown" | "timer";
    constantLineTime: number;
    totalTypeCount: number;
  }) => {
    const lineTypeCount = statusRef.current!.lineStatus.lineType;
    const newLineTypeCount = updateType === "keydown" ? lineTypeCount + 1 : lineTypeCount;

    const newTotalTypeCount = updateType === "keydown" ? totalTypeCount + 1 : totalTypeCount;
    const lineKpm = calcLineKpm({ constantLineTime, newLineTypeCount });

    const lineLatency = statusRef.current!.lineStatus.latency;
    const rkpmTime = constantLineTime - lineLatency;

    const lineRkpm = calcLineRkpm({ rkpmTime, newLineTypeCount, lineKpm });
    const totalTypeTime = constantLineTime + statusRef.current!.status.totalTypeTime;

    const totalKpm = calcTotalKpm({ newTotalTypeCount, totalTypeTime });

    return { lineKpm, lineRkpm, totalKpm };
  };
};
