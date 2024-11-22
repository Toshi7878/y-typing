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
import { useParams } from "next/navigation";
import { CARD_BODY_MIN_HEIGHT } from "../TypingCard";

interface EndProps {
  onOpen: () => void;
}

const End = ({ onOpen }: EndProps) => {
  const { data: session } = useSession();

  const { id: mapId } = useParams();

  const speedData = useTypePageSpeedAtom();
  const lineResults = useLineResultsAtom();

  const { bestScoreRef, statusRef, tabStatusRef, gameStateRef } = useRefs();

  const status = tabStatusRef.current!.getStatus();

  const upload = async (): Promise<ReturnType<typeof actions>> => {
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
      romaKpm: Math.round((kanaToRomaConvertCount / totalTypeTime) * 60),
      defaultSpeed: speedData.defaultSpeed,
      clearRate: +statusRef.current!.status.clearRate.toFixed(1),
    };
    const sendData = {
      mapId: Number(mapId),
      status: sendStatus,
    };

    const result = await actions(sendData);

    const jsonString = JSON.stringify(lineResults, null, 2);

    if (result) {
      // Supabaseストレージにアップロード
      const { data, error } = await supabase.storage
        .from("user-result") // バケット名を指定
        .upload(`public/${result.id}.json`, new Blob([jsonString], { type: "application/json" }), {
          upsert: true, // 既存のファイルを上書きするオプションを追加
        });

      if (error) {
        console.error("Error uploading to Supabase:", error);
        throw error;
      }
    }
    return result;
  };

  const [state, formAction] = useFormState(upload, INITIAL_STATE);

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
