import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { defaultStatusRef, useRefs } from "@/app/type/(contexts)/refsProvider";
import { useSession } from "next-auth/react";
import { StatusRef } from "@/app/type/(ts)/type";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";

const EndRetryButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const { data: session } = useSession();
  const { bestScoreRef, statusRef, tabStatusRef, playerRef, gameStateRef, playingComboRef } =
    useRefs();
  const status = tabStatusRef.current!.getStatus();
  const [, setScene] = useAtom(sceneAtom);

  const retry = () => {
    if (session && status.score > bestScoreRef.current) {
      onOpen();
    } else {
      proceedRetry();
    }
  };

  const proceedRetry = () => {
    setScene("playing");
    (statusRef.current as StatusRef) = structuredClone(defaultStatusRef);
    tabStatusRef.current!.resetStatus();
    playingComboRef.current!.setCombo(0);
    gameStateRef.current!.isRetrySkip = true;
    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
  };

  return (
    <>
      {/* ... existing code ... */}
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
              ランキング登録が完了していませんが、リトライしますか？
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onClose();
                  proceedRetry();
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
        onClick={retry}
      >
        もう一度プレイ
      </Button>
    </>
  );
};

export default EndRetryButton;
