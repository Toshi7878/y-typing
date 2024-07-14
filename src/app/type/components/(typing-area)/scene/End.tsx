import { Box, Button, HStack, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import EndUploadButton from "./child/EndRankingButton";
import { actions } from "@/app/type/(ts)/actions";
import { mapIdAtom, statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { LineResultObj } from "@/app/type/(ts)/type";
import { useFormState } from "react-dom";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import PlayingTop from "./child/PlayingTop";
import PlayingBottom from "./child/PlayingBottom";

interface EndProps {
  lineResultRef: React.RefObject<LineResultObj[]>;
}
const End = ({ lineResultRef }: EndProps) => {
  const toast = useToast();
  const [mapId] = useAtom(mapIdAtom);
  const { bestScoreRef } = useRefs();

  const initialState = { id: null, message: "", status: 0 };
  const [status] = useAtom(statusAtom);
  const lineProgressRef = useRef(null);
  const totalTimeProgressRef = useRef(null);
  const skipGuideRef = useRef(null);

  const upload = () => {
    const sendStatus = {
      score: status.display.score,
      romaType: status.romaType,
      kanaType: status.kanaType,
      flickType: status.flickType,
      miss: status.display.miss,
      lost: status.display.lost,
      rkpm: 0,
      maxCombo: status.maxCombo,
      kpm: status.display.kpm,
      playSpeed: 1,
    };
    const sendData = {
      mapId: mapId,
      lineResult: lineResultRef.current,
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
    <Box height="100vh" display="flex" flexDirection="column">
      <PlayingTop lineProgressRef={lineProgressRef} />
      <Box flex="1" className="text-center mx-6">
        <form action={status.display.score >= bestScoreRef.current ? formAction : undefined}>
          <Stack display="flex" spacing={8}>
            <Box textAlign="left" className="text-2xl" mx={2}>
              {status.display.score >= bestScoreRef.current ? (
                <>
                  おめでとうございます！最高スコアが{bestScoreRef.current}から{status.display.score}
                  に更新されました！
                </>
              ) : (
                <>
                  最高スコアは{bestScoreRef.current}です。最高スコアまであと
                  {bestScoreRef.current - status.display.score}です。
                </>
              )}
            </Box>
            <HStack justifyContent="space-around">
              {status.display.score >= bestScoreRef.current && (
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
              <Button
                size="2xl"
                px={12}
                py={6}
                fontSize="2xl"
                variant="outline"
                borderColor="black"
              >
                もう一度プレイ
              </Button>
            </Box>
          </Stack>
        </form>
        {/* ) : (
          ""
        )} */}
      </Box>
      <PlayingBottom skipGuideRef={skipGuideRef} totalTimeProgressRef={totalTimeProgressRef} />
    </Box>
  );
};

export default End;
