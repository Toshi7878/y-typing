import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Badge, HStack, Kbd } from "@chakra-ui/react";
import styled from "@emotion/styled";

import { useAtomValue } from "jotai";

interface PlayingBottomBadgeProps {
  badgeText: string;
  kbdText: string;
  isPauseDisabled: boolean;
  onClick: () => void;
}
const StyledKbd = styled(Kbd)<{ isDisabled: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
  transform: scale(1.20);
`}
  }
`;

const StyledBadge = styled(Badge)<{ isDisabled: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
      transform: scale(1.05);
      `}
  }
`;
const PlayingBottomBadge = function (props: PlayingBottomBadgeProps) {
  const notify = useAtomValue(playingNotifyAtom);
  const isDisabled = notify.description === "ll" && props.isPauseDisabled;

  return (
    <HStack>
      <StyledBadge
        py={1}
        px={4}
        isDisabled={isDisabled}
        fontSize="lg"
        as="button"
        onClick={isDisabled ? undefined : props.onClick}
        borderRadius="3xl"
        opacity={isDisabled ? 0.5 : 1}
        bg={"type.card.bg"}
        color={"color"}
        borderWidth="1px"
        borderStyle="solid"
        borderColor={"type.card.borderColor"}
      >
        {props.badgeText}
      </StyledBadge>
      <StyledKbd
        isDisabled={isDisabled}
        fontSize="xl"
        bg={"background"}
        color={"color"}
        borderColor={"type.card.borderColor"}
        borderWidth="1px"
        borderStyle="solid"
        opacity={isDisabled ? 0.5 : 0.8}
        onClick={isDisabled ? undefined : props.onClick}
      >
        {props.kbdText}
      </StyledKbd>
    </HStack>
  );
};

PlayingBottomBadge.displayName = "PlayingBottomBadge";

export default PlayingBottomBadge;
