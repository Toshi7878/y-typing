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
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
  background-color: var(--chakra-colors-gray-100);
  transform: scale(1.20);
`}
  }
`;

const StyledBadge = styled(Badge)<{ isDisabled: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
  background-color: var(--chakra-colors-gray-100);
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
        cursor="pointer"
        border="1px solid black"
        borderRadius="3xl"
        onClick={isDisabled ? undefined : props.onClick}
        opacity={isDisabled ? 0.5 : 1}
      >
        {props.badgeText}
      </StyledBadge>
      <StyledKbd
        isDisabled={isDisabled}
        fontSize="xl"
        border="1px solid"
        onClick={isDisabled ? undefined : props.onClick}
      >
        {props.kbdText}
      </StyledKbd>
    </HStack>
  );
};

PlayingBottomBadge.displayName = "PlayingBottomBadge";

export default PlayingBottomBadge;
