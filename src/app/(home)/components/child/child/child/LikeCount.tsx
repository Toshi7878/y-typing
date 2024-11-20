import { Box, Button, Flex, useTheme } from "@chakra-ui/react";
import React, { useState } from "react";
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
  const [hasLocalLike, setHasLocalLike] = useState(map.hasLike);
  const [localLikeCount, setLocalLikeCount] = useState(map.likeCount);

  const toggleLikeAction = (state: UploadResult): Promise<UploadResult> => {
    // 楽観的UI更新
    const newHasLike = !hasLocalLike;
    const newLikeCount = newHasLike ? localLikeCount + 1 : localLikeCount - 1;
    setHasLocalLike(newHasLike);
    setLocalLikeCount(newLikeCount);

    try {
      return toggleLikeServerAction(Number(map.id));
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す
      setHasLocalLike(hasLocalLike);
      setLocalLikeCount(localLikeCount);

      return Promise.reject(error); // エラーを返す
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
        color={hasLocalLike ? "#f472b6" : `${theme.colors.color}99`}
        rounded="md"
        _hover={{ bg: "#f472b660" }} // ホバー時に背景色を薄ピンクに設定
        px={1}
      >
        <Box mr={1} position="relative" top="2.5px">
          {hasLocalLike ? <FaHeart size={16} /> : <FiHeart size={17} />}
        </Box>
        <Box fontSize="lg" fontFamily="monospace">
          {localLikeCount}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LikeCount;
