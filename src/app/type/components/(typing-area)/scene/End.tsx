import { Box, Button, HStack, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import EndUploadButton from "./child/EndRankingButton";
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
import PlayingTop from "./child/PlayingTop";
import PlayingBottom from "./child/PlayingBottom";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { useSession } from "next-auth/react";
import EndRetryButton from "./child/EndRetryButton";

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

  const upload = () => {
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

  const isPlayingMode =
    gameStateRef.current!.replay.userName === "" && !gameStateRef.current!.practice.isPracticeMode;

  const isDisplayRankingButton =
    session &&
    status.score > 0 &&
    status.score >= bestScoreRef.current &&
    speedData.defaultSpeed >= 1 &&
    isPlayingMode;
  return (
    <Box display="flex" flexDirection="column">
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={PlayingRemainTimeRef} />
      <Box flex="1" className="text-center mx-6">
        <form action={status.score >= bestScoreRef.current ? formAction : undefined}>
          <Stack display="flex" spacing={8}>
            <Box textAlign="left" className="text-3xl" mx={2}>
              {gameStateRef.current!.practice.isPracticeMode ? (
                <>練習モード終了</>
              ) : gameStateRef.current!.replay.userName !== "" ? (
                <>リプレイ再生終了</>
              ) : !session ? (
                <>
                  スコアは{status.score}
                  です。ログインをするとランキングに登録することができます。
                </>
              ) : bestScoreRef.current === 0 ? (
                <>初めての記録です！スコアは{status.score}です。</>
              ) : status.score > bestScoreRef.current ? (
                <>
                  おめでとうございます！最高スコアが{bestScoreRef.current}から{status.score}
                  に更新されました！
                </>
              ) : (
                <>
                  最高スコアは{bestScoreRef.current}です。記録更新まであと
                  {bestScoreRef.current - status.score}です。
                </>
              )}
            </Box>
            <Box textAlign="left" className="text-3xl" mx={2}>
              {speedData.defaultSpeed < 1 && <>1.00倍速以上でランキング登録できます。</>}
            </Box>
            <HStack justifyContent="space-around" className="end-main-buttons">
              {isDisplayRankingButton && <EndUploadButton responseStatus={state.status} />}
              <Button
                className="cursor-pointer"
                variant="solid"
                py={12}
                width="450px"
                colorScheme="blue"
                border="1px"
                borderColor="black"
                _hover={{ bg: "#3a90f3" }}
                fontSize="3xl"
                onClick={onOpen}
              >
                詳細リザルトを見る
              </Button>
              <Button
                className="cursor-pointer"
                variant="solid"
                py={12} // ボタンの縦幅を大きくする
                width="450px" // ボタンの幅を大きくする
                colorScheme="blue"
                border="1px"
                borderColor="black"
                _hover={{ bg: "#3a90f3" }}
                fontSize="3xl" // 文字サイズを大きくする
              >
                結果をXにポスト
              </Button>
            </HStack>
            <HStack
              spacing={14}
              justifyContent="flex-end"
              mx="12"
              mt="12"
              className="end-sub-buttons"
            >
              {isPlayingMode && (
                <EndRetryButton
                  retryMode="practice"
                  isRetryAlert={Boolean(isDisplayRankingButton && state.status !== 200)}
                />
              )}

              <EndRetryButton
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
          </Stack>
        </form>
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
