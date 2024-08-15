import { Box, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { actions } from "@/app/type/(ts)/actions";
import {
  lineResultsAtom,
  mapIdAtom,
  speedAtom,
  tabIndexAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useFormState } from "react-dom";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import PlayingTop from "./playing-child/PlayingTop";
import { PlayingLineTimeRef } from "./playing-child/child/PlayingLineTime";
import { useSession } from "next-auth/react";
import EndText from "./end-child/EndText";
import PlayingBottom from "./playing-child/PlayingBottom";
import EndSubButtonContainer from "./end-child/EndSubButtonContainer";
import EndMainButtonContainer from "./end-child/EndMainButtonContainer";

interface EndProps {
  onOpen: () => void;
}

const End = ({ onOpen }: EndProps) => {
  const { data: session } = useSession();
  const setTabIndex = useSetAtom(tabIndexAtom);

  const toast = useToast();
  const mapId = useAtomValue(mapIdAtom);
  const speedData = useAtomValue(speedAtom);
  const lineResults = useAtomValue(lineResultsAtom);

  const { bestScoreRef, statusRef, tabStatusRef, gameStateRef } = useRefs();
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const PlayingRemainTimeRef = useRef<PlayingLineTimeRef>(null);
  const playingTotalTimeRef = useRef(null);

  const initialState = { id: null, message: "", status: 0 };
  const totalTimeProgressRef = useRef(null);
  const skipGuideRef = useRef(null);
  const status = tabStatusRef.current!.getStatus();

  const upload = (): ReturnType<typeof actions> => {
    const rkpmTime =
      statusRef.current!.status.totalTypeTime - statusRef.current!.status.totalLatency;

    const score = status.score;
    const sendStatus = {
      romaType: statusRef.current!.status.romaType,
      kanaType: statusRef.current!.status.kanaType,
      flickType: statusRef.current!.status.flickType,
      miss: status.miss,
      lost: status.lost,
      rkpm: Math.round((status.type / rkpmTime) * 60),
      maxCombo: statusRef.current!.status.maxCombo,
      kpm: status.kpm,
      defaultSpeed: speedData.defaultSpeed,
    };
    const sendData = {
      mapId: mapId,
      lineResult: lineResults,
      status: sendStatus,
      score,
    };

    const result = actions(sendData);

    return result;
  };

  const [state, formAction] = useFormState(upload, initialState);

  useEffect(() => {
    async function handleStateChange() {
      if (state.status && state.status !== 200) {
        toast({
          title: "保存に失敗しました",
          description: <small>{state.message}</small>,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            border: "1px solid",

            borderColor: "gray.200",
            fontSize: "lg", // サイズを大きくする
          },
        });
      } else if (state.status === 200) {
        toast({
          title: state.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            border: "1px solid",

            borderColor: "gray.200",
            fontSize: "lg", // サイズを大きくする
          },
        });
        setTabIndex(1);
      }
    }
    handleStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const isPerfect = status.miss === 0 && status.lost === 0;
  const isPlayingMode =
    gameStateRef.current!.replay.userName === "" && !gameStateRef.current!.practice.isPracticeMode;

  const isScoreUpdated = status.score >= bestScoreRef.current;

  const isDisplayRankingButton: boolean =
    !!session &&
    status.score > 0 &&
    (isScoreUpdated || isPerfect) &&
    speedData.defaultSpeed >= 1 &&
    isPlayingMode;
  return (
    <Box display="flex" flexDirection="column">
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={PlayingRemainTimeRef} />
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
          />
          <EndSubButtonContainer
            isPlayingMode={isPlayingMode}
            isDisplayRankingButton={isDisplayRankingButton}
            state={state}
            gameStateRef={gameStateRef}
          />
        </Stack>
      </Box>
      <PlayingBottom
        skipGuideRef={skipGuideRef}
        totalTimeProgressRef={totalTimeProgressRef}
        playingTotalTimeRef={playingTotalTimeRef}
      />
    </Box>
  );
};

export default End;
