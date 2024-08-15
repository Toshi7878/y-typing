"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react"; // useRefを追加
import { useFormStatus } from "react-dom";
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

interface UploadButtonProps {
  responseStatus: number;
  isScoreUpdated: boolean;
  formAction: () => void;
}

const EndUploadButton = ({ responseStatus, isScoreUpdated, formAction }: UploadButtonProps) => {
  const { pending } = useFormStatus();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (responseStatus === 200) {
      setIsDisabled(true);
      queryClient.invalidateQueries({ queryKey: ["userRanking"] });
      onClose();
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus]);

  const handleClick = () => {
    if (!isScoreUpdated) {
      onOpen();
    }
  };

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
                <Button colorScheme="red" type="submit" isLoading={pending} ml={3}>
                  ランキングに登録
                </Button>
              </Box>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box as="form" action={formAction}>
        <EndMainButton
          text={isDisabled ? "ランキング登録完了" : "ランキング登録"}
          isDisabled={isDisabled}
          pending={pending}
          type={isScoreUpdated ? "submit" : "button"}
          onClick={handleClick}
        />
      </Box>
    </>
  );
};

export default EndUploadButton;
