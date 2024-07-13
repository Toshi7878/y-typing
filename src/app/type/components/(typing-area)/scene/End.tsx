import { Box, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import UploadButton from "./child/RankingButton";
import { actions } from "@/app/type/(ts)/actions";
import { mapIdAtom, statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
import { LineResultObj } from "@/app/type/(ts)/type";
import { useFormState } from "react-dom";
import { useRefs } from "@/app/type/(contexts)/refsProvider";

interface EndProps {
  lineResultRef: React.RefObject<LineResultObj[]>;
}
const End = ({ lineResultRef }: EndProps) => {
  const toast = useToast();
  const [mapId] = useAtom(mapIdAtom);
  const { bestScoreRef } = useRefs();

  const initialState = { id: null, message: "", status: 0 };
  const [status] = useAtom(statusAtom);

  const upload = () => {
    const sendStatus = {
      score: status.score,
      type: status.type,
      miss: status.miss,
      lost: status.lost,
      maxCombo: status.maxCombo,
      kpm: status.kpm,
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
    <Box flex="1" className="text-3xl text-center">
      終了画面(リザルト・ランキング登録ボタンを設置)
      {status.score > bestScoreRef.current ? (
        <form action={formAction}>
          <Stack display="flex" flexDirection="column" gap="6">
            <UploadButton responseStatus={state.status} />
          </Stack>
        </form>
      ) : (
        ""
      )}
    </Box>
  );
};

export default End;
