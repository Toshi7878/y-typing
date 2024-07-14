import { Box, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import UploadButton from "./child/RankingButton";
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
      <Box flex="1" className="text-3xl text-center">
        終了画面(リザルト・ランキング登録ボタンを設置)
        {status.display.score > bestScoreRef.current ? (
          <form action={formAction}>
            <Stack display="flex" flexDirection="column" gap="6">
              <UploadButton responseStatus={state.status} />
            </Stack>
          </form>
        ) : (
          ""
        )}
      </Box>
      <PlayingBottom skipGuideRef={skipGuideRef} totalTimeProgressRef={totalTimeProgressRef} />
    </Box>
  );
};

export default End;
