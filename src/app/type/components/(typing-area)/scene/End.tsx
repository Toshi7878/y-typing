import { Box, Button, HStack, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import EndUploadButton from "./child/EndRankingButton";
import { actions } from "@/app/type/(ts)/actions";
import { mapIdAtom, sceneAtom, speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { useFormState } from "react-dom";
import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import PlayingTop from "./child/PlayingTop";
import PlayingBottom from "./child/PlayingBottom";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { useSession } from "next-auth/react";
import { StatusRef } from "@/app/type/(ts)/type";
import EndRetryButton from "./child/EndRetryButton";

const End = () => {
  const { data: session } = useSession();

  const toast = useToast();
  const [mapId] = useAtom(mapIdAtom);
  const [speedData] = useAtom(speedAtom);

  const { bestScoreRef, statusRef, tabStatusRef, playerRef } = useRefs();
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const PlayingRemainTimeRef = useRef<PlayingLineTimeRef>(null);
  const playingTotalTimeRef = useRef(null);

  const initialState = { id: null, message: "", status: 0 };
  const totalTimeProgressRef = useRef(null);
  const skipGuideRef = useRef(null);
  const status = tabStatusRef.current!.getStatus();

  const upload = () => {
    const sendStatus = {
      score: status.score,
      romaType: statusRef.current!.status.romaType,
      kanaType: statusRef.current!.status.kanaType,
      flickType: statusRef.current!.status.flickType,
      miss: status.miss,
      lost: status.lost,
      rkpm: 0,
      maxCombo: statusRef.current!.status.maxCombo,
      kpm: status.kpm,
      playSpeed: speedData.playSpeed,
    };
    const sendData = {
      mapId: mapId,
      lineResult: statusRef.current?.status.result,
      status: sendStatus,
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
      }
    }
    handleStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <Box display="flex" flexDirection="column">
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={PlayingRemainTimeRef} />
      <Box flex="1" className="text-center mx-6">
        <form action={status.score >= bestScoreRef.current ? formAction : undefined}>
          <Stack display="flex" spacing={8}>
            <Box textAlign="left" className="text-2xl" mx={2}>
              {!session ? (
                <>
                  スコアは{status.score}
                  です。ログインをするとランキングに登録することができます。
                </>
              ) : bestScoreRef.current === 0 ? (
                <>初めての記録です！スコアは{status.score}です。</>
              ) : status.score >= bestScoreRef.current ? (
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
            <HStack justifyContent="space-around">
              {session && status.score >= bestScoreRef.current && (
                <EndUploadButton responseStatus={state.status} />
              )}
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
            <Box display="flex" justifyContent="flex-end" mx="12" mt="12">
              <EndRetryButton />
            </Box>
          </Stack>
        </form>
        {/* ) : (
          ""
        )} */}
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
