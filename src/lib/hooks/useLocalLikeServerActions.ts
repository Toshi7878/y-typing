import { toggleLikeServerAction } from "@/config/server-actions/toggle-like-server-action";
import { LocalLikeState, UploadResult } from "@/types";
import { useOptimistic, useState } from "react";

export const useLocalLikeServerActions = ({ hasLike, likeCount }: LocalLikeState) => {
  const [LikeLocalState, setLikeLocalState] = useState<LocalLikeState>({
    hasLike,
    likeCount,
  });

  const [likeOptimisticState, setLikeOptimisticState] = useOptimistic(
    LikeLocalState,
    (currentState, newState) => {
      return newState as LocalLikeState;
    },
  );

  const toggleLikeAction = async (mapId: number): Promise<UploadResult> => {
    // 楽観的UI更新
    const newOptimisticState: LocalLikeState = {
      hasLike: !likeOptimisticState.hasLike,
      likeCount: likeOptimisticState.hasLike
        ? likeOptimisticState.likeCount - 1
        : likeOptimisticState.likeCount + 1,
    };

    setLikeOptimisticState(newOptimisticState);

    try {
      const result = await toggleLikeServerAction(mapId);
      if (result.id) {
        setLikeLocalState(newOptimisticState);
      }

      return result;
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す

      return Promise.reject(error); // エラーを返す
    }
  };

  return { likeOptimisticState, toggleLikeAction };
};
