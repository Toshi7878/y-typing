import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Badge, HStack, Kbd } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import styled from "@emotion/styled";

interface PlayingLineSeekBadgeProps {
  badgeText: string;
  kbdTextPrev: string;
  kbdTextNext: string;
  onClick: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const StyledKbd = styled(Kbd)<{ isDisabled: boolean }>`
  transition: all 0.2s;
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
      background-color: var(--chakra-colors-gray-200);
      outline:1px;
    `}
  }
`;

const StyledBadge = styled(Badge)<{ isDisabled: boolean }>`
  transition: all 0.2s;
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
      background-color: var(--chakra-colors-gray-100);
      transform: scale(1.05);
    `}
  }
`;

const PlayingLineSeekBadge = function (props: PlayingLineSeekBadgeProps) {
  const notify = useAtomValue(playingNotifyAtom);

  const isDisabled = notify.description === "ll";

  return (
    <HStack>
      <StyledKbd
        fontSize="lg"
        onClick={isDisabled ? undefined : props.onClickPrev}
        isDisabled={isDisabled}
      >
        {props.kbdTextPrev}
      </StyledKbd>
      <StyledBadge
        py={1}
        px={4}
        fontSize="md"
        as="button"
        border="1px solid black"
        borderRadius="3xl"
        onClick={isDisabled ? undefined : props.onClick}
        isDisabled={isDisabled}
      >
        {props.badgeText}
      </StyledBadge>
      <StyledKbd
        fontSize="lg"
        onClick={isDisabled ? undefined : props.onClickNext}
        isDisabled={isDisabled}
      >
        {props.kbdTextNext}
      </StyledKbd>
    </HStack>
  );
};

PlayingLineSeekBadge.displayName = "PlayingLineSeekBadge";

export default PlayingLineSeekBadge;
