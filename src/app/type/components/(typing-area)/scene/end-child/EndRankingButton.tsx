"use client";

import { useQueryClient } from "@tanstack/react-query";
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
  useToast,
} from "@chakra-ui/react"; // Chakra UIのコンポーネントをインポート
import EndMainButton from "./child/EndMainButton";
import { ActionState } from "@/app/type/(ts)/type";
import { tabIndexAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useSetAtom } from "jotai";
import AlertDialogButton from "./child/AlertDialogButton";

interface UploadButtonProps {
  isScoreUpdated: boolean;
  formAction: () => void;
  state: ActionState;
}

const EndUploadButton = ({ isScoreUpdated, formAction, state }: UploadButtonProps) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const setTabIndex = useSetAtom(tabIndexAtom);

  const toast = useToast();

  useEffect(() => {
    if (state.status === 200) {
      setIsDisabled(true);
      queryClient.invalidateQueries({ queryKey: ["userRanking"] });
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
    function handleStateChange() {
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
