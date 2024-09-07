"use client";
import {
  useEditPreviewTimeCountAtom,
  useSetCanUploadAtom,
  useSetEditPreviewTimeCountAtom,
} from "@/app/edit/edit-atom/editAtom";
import { ThemeColors } from "@/types";
import { FormLabel, Box, Checkbox, Text, Tooltip, useTheme } from "@chakra-ui/react";

interface PreviewTimeOptionProps {
  optionModalIndex: number | null;
}

export default function PreviewTimeOption({ optionModalIndex }: PreviewTimeOptionProps) {
  const theme: ThemeColors = useTheme();
  const setCanUpload = useSetCanUploadAtom();
  const previewTimeCount = useEditPreviewTimeCountAtom();
  const setPreviewTimeCount = useSetEditPreviewTimeCountAtom();

  return (
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
          <Box>有効にすると譜面一覧等でのプレビュー再生時に、有効にした時間から再生されます</Box>
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
              setCanUpload(true);
            }}
          />
        </FormLabel>
      </Tooltip>
    </Box>
  );
}
