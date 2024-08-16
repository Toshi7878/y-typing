import { HStack } from "@chakra-ui/react";
import React from "react";
import EndSubButton from "./child/EndSubButton";
import { ActionState, GameStateRef } from "@/app/type/(ts)/type";

interface EndSubButtonContainerProps {
  isPlayingMode: boolean;
  isDisplayRankingButton: boolean;
  state: ActionState;
  gameStateRef: React.RefObject<GameStateRef>;
}

const EndSubButtonContainer = ({
  isPlayingMode,
  isDisplayRankingButton,
  state,
  gameStateRef,
}: EndSubButtonContainerProps) => {
  return (
    <HStack spacing={14} justifyContent="flex-end" mx="12" mt="12" id="end_sub_buttons">
      {isPlayingMode && (
        <EndSubButton
          retryMode="practice"
          isRetryAlert={Boolean(isDisplayRankingButton && state.status !== 200)}
        />
      )}

      <EndSubButton
        retryMode={
          gameStateRef.current!.practice.isPracticeMode
            ? "practice"
            : gameStateRef.current!.replay.userName !== ""
              ? "replay"
              : "playing"
        }
        isRetryAlert={Boolean(isDisplayRankingButton && state.status !== 200)}
      />
    </HStack>
  );
};

export default EndSubButtonContainer;
