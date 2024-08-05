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
import { useAtom } from "jotai";
import { lineResultsAtom, mapAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { proceedRetry } from "@/app/type/(ts)/retry";

interface EndRetryButtonProps {
  isRetryAlert: boolean;
}

const EndRetryButton = ({ isRetryAlert }: EndRetryButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [, setLineResults] = useAtom(lineResultsAtom);

  const { statusRef, tabStatusRef, playerRef, gameStateRef, playingComboRef } = useRefs();
  const [, setScene] = useAtom(sceneAtom);
  const [map] = useAtom(mapAtom);

  const retry = (playMode: "playing" | "replay" | "practice") => {
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
                    "playing",
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
        px={12}
        py={6}
        fontSize="2xl"
        variant="outline"
        borderColor="black"
        onClick={() => {
          const playMode = gameStateRef.current?.practice.isPracticeMode ? "practice" : "playing";
          const finalPlayMode = gameStateRef.current?.replay.userName !== "" ? "replay" : playMode;
          retry(finalPlayMode);
        }}
      >
        {gameStateRef.current?.replay.userName !== "" ? "もう一度リプレイ" : "もう一度プレイ"}
      </Button>
    </>
  );
};

export default EndRetryButton;
