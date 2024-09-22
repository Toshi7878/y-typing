import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { actions } from "@/app/type/ts/scene-ts/end/actions";
import {
  useLineResultsAtom,
  useMapIdAtom,
  useTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useFormState } from "react-dom";
import { useRefs } from "@/app/type/type-contexts/refsProvider";

import { useSession } from "next-auth/react";
import EndText from "./end-child/EndText";
import EndSubButtonContainer from "./end-child/EndSubButtonContainer";
import EndMainButtonContainer from "./end-child/EndMainButtonContainer";
import { UploadResult } from "@/types";

interface EndProps {
  onOpen: () => void;
}

const End = ({ onOpen }: EndProps) => {
  const { data: session } = useSession();

  const mapId = useMapIdAtom();
  const speedData = useTypePageSpeedAtom();
  const lineResults = useLineResultsAtom();

  const { bestScoreRef, statusRef, tabStatusRef, gameStateRef } = useRefs();

  const initialState: UploadResult = { id: null, title: "", message: "", status: 0 };
  const status = tabStatusRef.current!.getStatus();

  const upload = (): ReturnType<typeof actions> => {
    const totalTypeTime = statusRef.current!.status.totalTypeTime;
    const rkpmTime = totalTypeTime - statusRef.current!.status.totalLatency;
    const kanaToRomaConvertCount = statusRef.current!.status.kanaToRomaConvertCount;

    const sendStatus = {
      score: status.score,
      romaType: statusRef.current!.status.romaType,
      kanaType: statusRef.current!.status.kanaType,
      flickType: statusRef.current!.status.flickType,
      miss: status.miss,
      lost: status.lost,
      rkpm: Math.round((status.type / rkpmTime) * 60),
      maxCombo: statusRef.current!.status.maxCombo,
      kpm: status.kpm,
      romaKpm: Math.round((kanaToRomaConvertCount / rkpmTime) * 60),
      defaultSpeed: speedData.defaultSpeed,
      clearRate: Math.floor(statusRef.current!.status.clearRate * 10) / 10,
    };
    const sendData = {
      mapId: mapId,
      lineResult: lineResults,
      status: sendStatus,
    };

    const result = actions(sendData);

    return result;
  };

  const [state, formAction] = useFormState(upload, initialState);

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
    <Box flex="1" className="text-center mx-6">
      <Stack display="flex" spacing={8}>
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
    </Box>
  );
};

export default End;
