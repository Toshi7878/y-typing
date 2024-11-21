"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormLabel,
  Box,
  Stack,
  Badge,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import { MapData } from "@/app/type/ts/type";
import CSSTextLength from "./line-option-child/CSSTextLength";
import CSSInput from "./line-option-child/CSSInput";
import SaveOptionButton from "./line-option-child/SaveOptionButton";
import LineOptionModalCloseButton from "./line-option-child/LineOptionModalCloseButton";
import { ThemeColors } from "@/types";

interface LineOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionModalIndex: number | null;
  lineOptions: MapData["options"] | null;
}

export default function LineOptionModal({
  isOpen,
  onClose,
  optionModalIndex,
  lineOptions,
}: LineOptionModalProps) {
  const [changeCSS, setChangeCSS] = useState(lineOptions?.changeCSS || "");
  const [eternalCSS, setEternalCSS] = useState(lineOptions?.eternalCSS || "");
  const [isEditedCSS, setIsEditedCSS] = useState(false);
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  const theme: ThemeColors = useTheme();
  const handleModalClose = () => {
    if (isEditedCSS) {
      onConfirmOpen();
    } else {
      onClose();
    }
  };
  return (
    <Modal isOpen={isOpen} isCentered onClose={handleModalClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW="600px" bg={theme.colors.background.card} color={"text.body"}>
        <ModalHeader>ラインオプション </ModalHeader>

        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody>
          <Badge colorScheme="teal" fontSize="1em">
            選択ライン: {optionModalIndex}
          </Badge>

          <Stack spacing={10}>
            {optionModalIndex === 0 && (
              <Box>
                <FormLabel>永続的に適用するCSSを入力</FormLabel>
                <CSSInput
                  CSSText={eternalCSS}
                  setCSSText={setEternalCSS}
                  setIsEditedCSS={setIsEditedCSS}
                />
                <CSSTextLength
                  eternalCSSText={eternalCSS}
                  changeCSSText={changeCSS}
                  lineOptions={lineOptions}
                />
              </Box>
            )}

            <Box>
              <FormLabel>選択ラインから適用するCSSを入力</FormLabel>
              <CSSInput
                CSSText={changeCSS}
                setCSSText={setChangeCSS}
                setIsEditedCSS={setIsEditedCSS}
              />
              <CSSTextLength
                eternalCSSText={eternalCSS}
                changeCSSText={changeCSS}
                lineOptions={lineOptions}
              />
            </Box>

            <SaveOptionButton
              eternalCSS={eternalCSS}
              changeCSS={changeCSS}
              isEditedCSS={isEditedCSS}
              optionModalIndex={optionModalIndex}
              onClose={onClose}
              setIsEditedCSS={setIsEditedCSS}
            />
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
      <LineOptionModalCloseButton
        onClose={onClose}
        isConfirmOpen={isConfirmOpen}
        onConfirmClose={onConfirmClose}
      />
    </Modal>
  );
}
