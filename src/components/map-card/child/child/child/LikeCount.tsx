import { Box, Flex, useTheme } from "@chakra-ui/react";
import React from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { MapCardInfo } from "@/app/(home)/ts/type";
import { ThemeColors } from "@/types";
import { useFormState } from "react-dom";
import { INITIAL_STATE } from "@/config/consts";
import { useLocalLikeServerActions } from "@/lib/hooks/useLocalLikeServerActions";
import { useSession } from "next-auth/react";

interface LikeCountProps {
  map: MapCardInfo;
}

const LikeCount = (props: LikeCountProps) => {
  const theme: ThemeColors = useTheme();
  const { map } = props;
  const { data: session } = useSession();
  const { likeOptimisticState, toggleLikeAction } = useLocalLikeServerActions({
    hasLike: props.map.hasLike,
    likeCount: props.map.likeCount,
  });

  const [state, formAction] = useFormState(async () => {
    const result = await toggleLikeAction(map.id);

    return result;
  }, INITIAL_STATE);
  const preventClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  return (
    <Flex
      as="form"
      action={session?.user.id ? formAction : ""}
      onClick={session?.user.id ? preventClick : undefined}
    >
      <Flex
        as="button"
        type={session?.user.id ? "submit" : "button"}
        alignItems="baseline"
        color={
          likeOptimisticState.hasLike ? theme.colors.semantic.like : `${theme.colors.text.body}99`
        }
        rounded="md"
        _hover={session?.user.id ? { bg: `${theme.colors.semantic.like}60` } : ""}
        px={1}
      >
        <Box mr={1} position="relative" top="2.5px">
          {likeOptimisticState.hasLike ? <FaHeart size={16} /> : <FiHeart size={17} />}
        </Box>
        <Box fontSize="lg" fontFamily="monospace">
          {likeOptimisticState.likeCount}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LikeCount;
