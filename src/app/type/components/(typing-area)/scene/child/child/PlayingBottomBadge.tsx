import { Badge, HStack, Kbd } from "@chakra-ui/react";

interface PlayingBottomBadgeProps {
  badgeText: string;
  kbdText: string;
}

const PlayingBottomBadge = function (props: PlayingBottomBadgeProps) {
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
      >
        {props.badgeText}
      </Badge>
      <Kbd fontSize="lg">{props.kbdText}</Kbd>
    </HStack>
  );
};

PlayingBottomBadge.displayName = "PlayingBottomBadge";

export default PlayingBottomBadge;
