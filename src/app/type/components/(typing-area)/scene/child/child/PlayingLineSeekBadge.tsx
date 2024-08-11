import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Badge, HStack, Kbd } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
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
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

const PlayingLineSeekBadge = function (props: PlayingLineSeekBadgeProps) {
  const notify = useAtomValue(playingNotifyAtom);

  const isDisabled = notify.description === "ll";

  return (
    <HStack>
      <StyledKbd
        fontSize="xl"
        border="1px solid"
        onClick={isDisabled ? undefined : props.onClickPrev}
        isDisabled={isDisabled}
        bg={"background"}
        color={"color"}
      >
        {props.kbdTextPrev}
      </StyledKbd>
      <StyledBadge
        py={1}
        px={4}
        fontSize="lg"
        border="1px solid var(--chakra-colors-gray-200)"
        borderRadius="3xl"
        onClick={isDisabled ? undefined : props.onClick}
        isDisabled={isDisabled}
      >
        {props.badgeText}
      </StyledBadge>
      <StyledKbd
        fontSize="xl"
        border="1px solid"
        onClick={isDisabled ? undefined : props.onClickNext}
        isDisabled={isDisabled}
        bg={"background"}
        color={"color"}
      >
        {props.kbdTextNext}
      </StyledKbd>
    </HStack>
  );
};

PlayingLineSeekBadge.displayName = "PlayingLineSeekBadge";

export default PlayingLineSeekBadge;
