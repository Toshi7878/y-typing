import { HStack } from "@chakra-ui/react";
import React from "react";
import EndUploadButton from "./EndRankingButton";
import EndMainButton from "./child/EndMainButton";

interface EndMainButtonContainerProps {
  isDisplayRankingButton: boolean;
  isScoreUpdated: boolean;
  state: any;
  onOpen: () => void;
  formAction: () => void;
}

const EndMainButtonContainer = ({
  isDisplayRankingButton,
  isScoreUpdated,
  state,
  onOpen,
  formAction,
}: EndMainButtonContainerProps) => {
  return (
    <HStack justifyContent="space-around" id="end_main_buttons">
      {isDisplayRankingButton && (
        <EndUploadButton
          responseStatus={state.status}
          isScoreUpdated={isScoreUpdated}
          formAction={formAction}
        />
      )}

      <EndMainButton text={"詳細リザルトを見る"} onClick={onOpen} />

      <EndMainButton text={"結果をXにポスト"} onClick={() => {}} />
    </HStack>
  );
};

export default EndMainButtonContainer;
