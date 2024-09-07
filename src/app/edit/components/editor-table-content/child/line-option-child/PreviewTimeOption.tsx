"use client";
import {
  useEditPreviewTimeCountAtom,
  useSetCanUploadAtom,
  useSetEditPreviewTimeCountAtom,
} from "@/app/edit/edit-atom/editAtom";
import CustomToolTip from "@/components/CustomToolTip";
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
      <CustomToolTip
        tooltipLabel={
          <Box>有効にすると譜面一覧等でのプレビュー再生時に、有効にした時間から再生されます</Box>
        }
        placement="right"
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
      </CustomToolTip>
    </Box>
  );
}
