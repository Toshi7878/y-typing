"use client";
import {
  useEditPreviewTimeCountAtom,
  useSetCanUploadAtom,
  useSetEditPreviewTimeCountAtom,
} from "@/app/edit/edit-atom/editAtom";
import { setLineOption } from "@/app/edit/redux/mapDataSlice";
import { ThemeColors } from "@/types";
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
  Checkbox,
  Text,
  Tooltip,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LineOptionModal({ isOpen, onClose, optionModalIndex, lineOptions }) {
  const [changeCSS, setChangeCSS] = useState(lineOptions?.changeCSS || "");
  const [eternalCSS, setEternalCSS] = useState(lineOptions?.eternalCSS || "");
  const theme: ThemeColors = useTheme();
  const dispatch = useDispatch();
  const setCanUpload = useSetCanUploadAtom();
  const previewTimeCount = useEditPreviewTimeCountAtom();
  const setPreviewTimeCount = useSetEditPreviewTimeCountAtom();

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
            <Box>
              <Tooltip
                bg={theme.colors.popup.bg}
                color={theme.colors.popup.color}
                borderWidth="1px"
                borderStyle="solid"
                borderColor={theme.colors.card.borderColor}
                css={{
                  "--popper-arrow-bg": theme.colors.popup.bg,
                  "--popper-arrow-shadow-color": theme.colors.card.borderColor,
                }}
                hasArrow
                placement="right"
                label={
                  <Box>
                    有効にすると譜面一覧等でのプレビュー再生時に、有効にした時間から再生されます
                  </Box>
                }
                isDisabled={previewTimeCount === optionModalIndex}
              >
                <FormLabel display="flex" cursor="pointer" width="fit-content">
                  <Text as="span" mr={2}>
                    プレビュー再生タイムに設定
                  </Text>
                  <Checkbox
                    isChecked={previewTimeCount === optionModalIndex}
                    onChange={() => {
                      if (previewTimeCount === optionModalIndex) {
                        setPreviewTimeCount(null);
                      } else {
                        setPreviewTimeCount(optionModalIndex);
                      }
                    }}
                  />
                </FormLabel>
              </Tooltip>
            </Box>
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
