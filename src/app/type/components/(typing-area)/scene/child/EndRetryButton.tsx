import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
} from "@chakra-ui/react";

import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { lineResultsAtom, mapAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { proceedRetry } from "@/app/type/(ts)/retry";
import { PlayMode } from "@/app/type/(ts)/type";

interface EndRetryButtonProps {
  retryMode: PlayMode;
  isRetryAlert: boolean;
}

const EndRetryButton = ({ isRetryAlert, retryMode }: EndRetryButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const setLineResults = useSetAtom(lineResultsAtom);

  const { statusRef, tabStatusRef, playerRef, gameStateRef, playingComboRef } = useRefs();
  const setScene = useSetAtom(sceneAtom);
  const map = useAtomValue(mapAtom);

  const retry = (playMode: PlayMode) => {
    if (isRetryAlert) {
      onOpen();
    } else {
      proceedRetry(
        playMode,
        setLineResults,
        map!,
        statusRef,
        setScene,
        tabStatusRef,
        playingComboRef,
        gameStateRef,
        playerRef,
      );
    }
  };

  const getButtonText = () => {
    if (retryMode === "practice") return "練習モード";
    if (gameStateRef.current?.replay.userName) return "もう一度リプレイ";
    return "もう一度プレイ";
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              リトライ確認
            </AlertDialogHeader>

            <AlertDialogBody>
              <Box>ランキング登録が完了していませんが、リトライしますか？</Box>
              <Box>※リトライすると今回の記録は失われます</Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onClose();
                  proceedRetry(
                    retryMode,
                    setLineResults,
                    map!,
                    statusRef,
                    setScene,
                    tabStatusRef,
                    playingComboRef,
                    gameStateRef,
                    playerRef,
                  );
                }}
                ml={3}
              >
                リトライ
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Button
        size="2xl"
        px={20}
        py={6}
        fontSize="2xl"
        variant="outline"
        borderColor="black"
        onClick={() => {
          retry(retryMode);
        }}
      >
        {getButtonText()}
      </Button>
    </>
  );
};

export default EndRetryButton;
