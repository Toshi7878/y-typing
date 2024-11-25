import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { actions } from "@/app/type/ts/scene-ts/end/actions";
import { useLineResultsAtom, useTypePageSpeedAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useFormState } from "react-dom";
import { useRefs } from "@/app/type/type-contexts/refsProvider";

import { useSession } from "next-auth/react";
import EndText from "./end-child/EndText";
import EndSubButtonContainer from "./end-child/EndSubButtonContainer";
import EndMainButtonContainer from "./end-child/EndMainButtonContainer";
import { supabase } from "@/lib/supabaseClient";
import { INITIAL_STATE } from "@/config/consts";
import { CARD_BODY_MIN_HEIGHT } from "../TypingCard";
import { Status } from "@/app/type/ts/type";
import { useSendResult } from "@/app/type/hooks/useSendResult";

interface EndProps {
  onOpen: () => void;
}

// const useDisplaySendRanking = () => {
//   const { bestScoreRef, tabStatusRef, gameStateRef } = useRefs();
//   const { data: session } = useSession();
//   const speedData = useTypePageSpeedAtom();

//   return () => {
//     const status: Status = tabStatusRef.current!.getStatus();

//     const isPerfect = status.miss === 0 && status.lost === 0;
//     const isPlayingMode = gameStateRef.current!.playMode === "playing";

//     const isScoreUpdated = status.score >= bestScoreRef.current;

//     const isDisplayRankingButton: boolean =
//       !!session &&
//       status.score > 0 &&
//       (isScoreUpdated || isPerfect) &&
//       speedData.defaultSpeed >= 1 &&
//       isPlayingMode;
//   };
// };

const End = ({ onOpen }: EndProps) => {
  const { data: session } = useSession();

  const speedData = useTypePageSpeedAtom();

  const sendResult = useSendResult();
  const [state, formAction] = useFormState(sendResult, INITIAL_STATE);

  const { bestScoreRef, tabStatusRef, gameStateRef } = useRefs();

  const status: Status = tabStatusRef.current?.getStatus();

  if (status === undefined) {
    return;
  }
  const isPerfect = status.miss === 0 && status.lost === 0;
  const isPlayingMode = gameStateRef.current!.playMode === "playing";

  const isScoreUpdated = status.score >= bestScoreRef.current;

  const isDisplayRankingButton: boolean =
    !!session &&
    status.score > 0 &&
    (isScoreUpdated || isPerfect) &&
    speedData.defaultSpeed >= 1 &&
    isPlayingMode;

  return (
    <Stack minH={CARD_BODY_MIN_HEIGHT} justifyContent="space-between">
      <EndText
        isPerfect={isPerfect}
        gameStateRef={gameStateRef}
        session={session}
        status={status}
        bestScoreRef={bestScoreRef}
        speedData={speedData}
      />
      <EndMainButtonContainer
        formAction={formAction}
        isDisplayRankingButton={isDisplayRankingButton}
        state={state}
        onOpen={onOpen}
        isScoreUpdated={isScoreUpdated}
        isPlayingMode={isPlayingMode}
      />
      <EndSubButtonContainer
        isPlayingMode={isPlayingMode}
        isDisplayRankingButton={isDisplayRankingButton}
        state={state}
        gameStateRef={gameStateRef}
      />
    </Stack>
  );
};

export default End;
