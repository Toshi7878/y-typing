import { HStack } from "@chakra-ui/react";
import React from "react";
import EndUploadButton from "./EndRankingButton";
import EndMainButton from "./child/EndMainButton";
import { ActionState } from "@/app/type/ts/type";

interface EndMainButtonContainerProps {
  isDisplayRankingButton: boolean;
  isScoreUpdated: boolean;
  state: ActionState;
  onOpen: () => void;
  formAction: () => void;
  isPlayingMode: boolean;
}

const EndMainButtonContainer = ({
  isDisplayRankingButton,
  isScoreUpdated,
  state,
  onOpen,
  formAction,
  isPlayingMode,
}: EndMainButtonContainerProps) => {
  return (
    <HStack justifyContent="space-around" id="end_main_buttons">
      {isDisplayRankingButton && (
        <EndUploadButton isScoreUpdated={isScoreUpdated} formAction={formAction} state={state} />
      )}

      <EndMainButton text={"詳細リザルトを見る"} onClick={onOpen} />
      {isPlayingMode && <EndMainButton text={"結果をXにポスト"} onClick={() => {}} />}
    </HStack>
  );
};

export default EndMainButtonContainer;
