import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Badge, HStack, Kbd } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";

interface PlayingBottomBadgeProps {
  badgeText: string;
  kbdText: string;
  isPauseDisabled: boolean;
  onClick: () => void;
}

const PlayingBottomBadge = function (props: PlayingBottomBadgeProps) {
  const notify = useAtomValue(playingNotifyAtom);
  const isDisabled = notify.description === "ll" && props.isPauseDisabled;

  return (
    <HStack>
      <Badge
        py={1}
        px={4}
        fontSize="md"
        as="button"
        cursor="pointer"
        border="1px solid black" // 黒い枠線を追加
        borderRadius="3xl"
        onClick={isDisabled ? undefined : props.onClick} // onClickを無効化
        opacity={isDisabled ? 0.5 : 1} // 半透明にする
      >
        {props.badgeText}
      </Badge>
      <Kbd fontSize="lg">{props.kbdText}</Kbd>
    </HStack>
  );
};

PlayingBottomBadge.displayName = "PlayingBottomBadge";

export default PlayingBottomBadge;
