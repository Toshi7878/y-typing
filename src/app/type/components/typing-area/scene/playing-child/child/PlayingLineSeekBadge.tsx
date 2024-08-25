import { playingNotifyAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { Badge, HStack, Kbd, useTheme } from "@chakra-ui/react";
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
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
      transform: scale(1.20);
    `}
  }
`;

const StyledBadge = styled(Badge)<{ isDisabled: boolean }>``;

const PlayingLineSeekBadge = function (props: PlayingLineSeekBadgeProps) {
  const notify = useAtomValue(playingNotifyAtom);

  const isDisabled = notify.description === "ll";
  const theme = useTheme();

  return (
    <HStack>
      <StyledKbd
        fontSize="xl"
        onClick={isDisabled ? undefined : props.onClickPrev}
        isDisabled={isDisabled}
        bg={theme.colors.background}
        color={theme.colors.color}
        className="bottom-card-kbd"
        borderColor={theme.colors.type.card.borderColor}
        borderWidth="1px"
        borderStyle="solid"
        opacity={isDisabled ? 0.5 : 0.8}
      >
        {props.kbdTextPrev}
      </StyledKbd>
      <StyledBadge
        py={1}
        px={4}
        fontSize="lg"
        borderRadius="3xl"
        opacity={isDisabled ? 0.5 : 1}
        bg={theme.colors.type.card.bg}
        color={theme.colors.color}
        className="bottom-card-badge"
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.colors.type.card.borderColor}
        onClick={isDisabled ? undefined : props.onClick}
        isDisabled={isDisabled}
      >
        {props.badgeText}
      </StyledBadge>
      <StyledKbd
        fontSize="xl"
        onClick={isDisabled ? undefined : props.onClickNext}
        isDisabled={isDisabled}
        bg={theme.colors.background}
        color={theme.colors.color}
        className="bottom-card-kbd"
        borderColor={theme.colors.type.card.borderColor}
        borderWidth="1px"
        borderStyle="solid"
        opacity={isDisabled ? 0.5 : 0.8}
      >
        {props.kbdTextNext}
      </StyledKbd>
    </HStack>
  );
};

PlayingLineSeekBadge.displayName = "PlayingLineSeekBadge";

export default PlayingLineSeekBadge;
