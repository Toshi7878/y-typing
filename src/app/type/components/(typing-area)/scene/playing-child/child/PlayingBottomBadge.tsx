import { playingNotifyAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Badge, HStack, Kbd } from "@chakra-ui/react";
import styled from "@emotion/styled";

import { useAtomValue } from "jotai";

interface PlayingBottomBadgeProps {
  badgeText: string;
  kbdText: string;
  isPauseDisabled: boolean;
  isKbdHidden: boolean;
  onClick: () => void;
}
const StyledKbd = styled(Kbd)<{ isDisabled: boolean; isKbdHidden: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  visibility: ${(props) => (props.isKbdHidden ? "hidden" : "visible")};
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
  transform: scale(1.20);
`}
  }
`;

const StyledBadge = styled(Badge)<{ isDisabled: boolean; isKbdHidden: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  transition: transform 0.1s ease-in-out;

  &:hover {
    ${(props) =>
      !props.isDisabled && !props.isKbdHidden
        ? `
      transform: scale(1.05);
      `
        : ""}
  }
`;
const PlayingBottomBadge = function (props: PlayingBottomBadgeProps) {
  const notify = useAtomValue(playingNotifyAtom);
  const scene = useAtomValue(sceneAtom);
  const isDisabled = notify.description === "ll" && props.isPauseDisabled;
  const isHidden = scene === "ready" || scene === "end";

  return (
    <HStack hidden={isHidden}>
      <StyledBadge
        py={1}
        px={4}
        isDisabled={isDisabled}
        isKbdHidden={props.isKbdHidden}
        fontSize="lg"
        as="button"
        className="bottom-card-badge"
        onClick={isDisabled || props.isKbdHidden ? undefined : props.onClick}
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
        isKbdHidden={props.isKbdHidden}
        fontSize="xl"
        bg={"background"}
        color={"color"}
        className="bottom-card-kbd"
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
