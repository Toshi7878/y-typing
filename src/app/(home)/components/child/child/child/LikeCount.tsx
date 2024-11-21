import { Box, Flex, useTheme } from "@chakra-ui/react";
import React, { useOptimistic, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { MapCardInfo } from "@/app/(home)/ts/type";
import { ThemeColors, UploadResult } from "@/types";
import { toggleLikeServerAction } from "@/config/server-actions/toggle-like-server-action";
import { useFormState } from "react-dom";
import { INITIAL_STATE } from "@/config/consts";

interface LikeCountProps {
  map: MapCardInfo;
}

const LikeCount = (props: LikeCountProps) => {
  const theme: ThemeColors = useTheme();
  const { map } = props;

  const [localState, setLocalState] = useState<{ hasLike: boolean; likeCount: number }>({
    hasLike: map.hasLike,
    likeCount: map.likeCount,
  });

  const [optimisticState, setOptimisticState] = useOptimistic(
    localState,
    (currentState, newState) => {
      return newState as { hasLike: boolean; likeCount: number };
    },
  );

  const toggleLikeAction = async (state: UploadResult): Promise<UploadResult> => {
    const newOptimisticState = {
      hasLike: !optimisticState.hasLike,
      likeCount: optimisticState.hasLike
        ? optimisticState.likeCount - 1
        : optimisticState.likeCount + 1,
    };
    setOptimisticState(newOptimisticState);

    try {
      const result = await toggleLikeServerAction(Number(map.id));
      if (result.id) {
        setLocalState(newOptimisticState);
      }
      return result;
    } catch (error) {
      setLocalState(localState);
      return Promise.reject(error);
    }
  };

  const [state, formAction] = useFormState(toggleLikeAction, INITIAL_STATE);
  const preventClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  return (
    <Flex as="form" action={formAction} onClick={preventClick}>
      <Flex
        as="button"
        type="submit"
        alignItems="baseline"
        color={optimisticState.hasLike ? theme.colors.semantic.like : `${theme.colors.text.body}99`}
        rounded="md"
        _hover={{ bg: `${theme.colors.semantic.like}60` }} // ホバー時に背景色を薄ピンクに設定
        px={1}
      >
        <Box mr={1} position="relative" top="2.5px">
          {optimisticState.hasLike ? <FaHeart size={16} /> : <FiHeart size={17} />}
        </Box>
        <Box fontSize="lg" fontFamily="monospace">
          {optimisticState.likeCount}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LikeCount;
