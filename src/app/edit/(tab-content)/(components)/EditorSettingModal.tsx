"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

export default function EditorSettingModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        width="60px"
        height="35px"
        colorScheme=""
        _hover={{ bg: "#ebdf92bb" }}
        onClick={onOpen}
      >
        設定
      </Button>
      {isOpen && (
        <div id="modal-root">
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader></ModalHeader>
              <ModalCloseButton />
              <ModalBody>譜面を作成したいYouTube動画のURLを入力</ModalBody>

              <ModalFooter>
                <Button colorScheme="blue">新規作成</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
}
