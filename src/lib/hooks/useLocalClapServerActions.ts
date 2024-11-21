import { toggleClapServerAction } from "@/config/server-actions/toggle-clap-server-action";
import { LocalClapState, UploadResult } from "@/types";
import { useOptimistic, useState } from "react";

export const useLocalClapServerActions = ({ hasClap, clapCount }: LocalClapState) => {
  const [clapLocalState, setClapLocalState] = useState<LocalClapState>({
    hasClap: hasClap,
    clapCount: clapCount,
  });

  const [clapOptimisticState, setClapOptimisticState] = useOptimistic(
    clapLocalState,
    (currentState, newState) => {
      return newState as LocalClapState;
    },
  );

  const toggleClapAction = async (resultId: number): Promise<UploadResult> => {
    // 楽観的UI更新
    const newOptimisticState = {
      hasClap: !clapOptimisticState.hasClap,
      clapCount: clapOptimisticState.hasClap
        ? clapOptimisticState.clapCount - 1
        : clapOptimisticState.clapCount + 1,
    };

    setClapOptimisticState(newOptimisticState);

    try {
      const result = await toggleClapServerAction(resultId);
      if (result.id) {
        setClapLocalState(newOptimisticState);
      }

      return result;
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す

      return Promise.reject(error); // エラーを返す
    }
  };

  return { clapOptimisticState, toggleClapAction };
};
