"use client";

import { useEffect, useState, useRef } from "react"; // useRefを追加
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Box,
} from "@chakra-ui/react"; // Chakra UIのコンポーネントをインポート
import EndMainButton from "./child/EndMainButton";
import AlertDialogButton from "./child/AlertDialogButton";
import { UploadResult } from "@/types";
import { useSuccessToast } from "@/lib/hooks/useSuccessToast";
import { useSetTabIndexAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { QUERY_KEYS } from "@/config/consts";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface UploadButtonProps {
  isScoreUpdated: boolean;
  formAction: () => void;
  state: UploadResult;
}

const EndUploadButton = ({ isScoreUpdated, formAction, state }: UploadButtonProps) => {
  const { id: mapId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const setTabIndex = useSetTabIndexAtom();
  const successToast = useSuccessToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (state.status === 200) {
      setIsDisabled(true);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapRanking(mapId) });
      onClose();
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const handleClick = () => {
    if (!isScoreUpdated) {
      onOpen();
    }
  };

  useEffect(() => {
    if (state.status !== 0) {
      successToast(state);

      const isSuccess = state.status === 200 ? true : false;

      if (isSuccess) {
        setTabIndex(1);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              スコア未更新
            </AlertDialogHeader>
            <AlertDialogBody>
              ランキング登録済みのスコアから下がりますが、ランキングに登録しますか？
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Box as="form" action={formAction}>
                <AlertDialogButton />
              </Box>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box as="form" action={formAction}>
        <EndMainButton
          text={isDisabled ? "ランキング登録完了" : "ランキング登録"}
          isDisabled={isDisabled}
          type={isScoreUpdated ? "submit" : "button"}
          onClick={handleClick}
        />
      </Box>
    </>
  );
};

export default EndUploadButton;
