"use client";
import { useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { setLineOption } from "@/app/edit/redux/mapDataSlice";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Textarea,
  FormLabel,
  Box,
  Stack,
  Badge,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LineOptionModal({ isOpen, onClose, optionModalIndex, lineOptions }) {
  const [changeCSS, setChangeCSS] = useState(lineOptions?.changeCSS || "");
  const [eternalCSS, setEternalCSS] = useState(lineOptions?.eternalCSS || "");
  const dispatch = useDispatch();
  const setCanUpload = useSetCanUploadAtom();

  const handleBtnClick = () => {
    dispatch(setLineOption({ options: { changeCSS, eternalCSS }, number: optionModalIndex }));
    setCanUpload(true);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>ラインオプション </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <Badge colorScheme="teal" fontSize="1em">
            選択ライン: {optionModalIndex}
          </Badge>

          <Stack spacing={10}>
            {optionModalIndex === 0 && (
              <Box>
                <FormLabel>永続的に適用するCSSを入力</FormLabel>
                <Textarea
                  placeholder=""
                  resize={"vertical"}
                  size="md"
                  height={"200px"}
                  value={eternalCSS}
                  onChange={(e) => setEternalCSS(e.target.value)}
                />
              </Box>
            )}

            <Box>
              <FormLabel>選択ラインから適用するCSSを入力</FormLabel>
              <Textarea
                placeholder=""
                resize={"vertical"}
                size="md"
                height={"200px"}
                value={changeCSS}
                onChange={(e) => setChangeCSS(e.target.value)}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button colorScheme="teal" onClick={handleBtnClick}>
                オプションを保存
              </Button>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
