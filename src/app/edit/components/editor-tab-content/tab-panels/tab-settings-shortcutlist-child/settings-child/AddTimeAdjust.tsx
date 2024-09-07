"use client";
import { FormLabel, Input, HStack, Box, useTheme, Tooltip } from "@chakra-ui/react";
import { ThemeColors } from "@/types";

import {
  useEditAddTimeOffsetAtom,
  useSetEditAddTimeOffsetAtom,
} from "@/app/edit/edit-atom/editAtom";
import { sendIndexedDB } from "@/lib/db";
import CustomToolTip from "@/components/CustomToolTip";

export default function AddTimeAdjust() {
  const theme: ThemeColors = useTheme();

  const addTimeOffset = useEditAddTimeOffsetAtom();
  const setAddTimeOffset = useSetEditAddTimeOffsetAtom();

  return (
    <HStack alignItems="baseline">
      <CustomToolTip
        tooltipLabel={<Box>再生中に追加ボタン(S)を押した時に、数値分タイムを補正します</Box>}
        placement="top"
      >
        <HStack alignItems="baseline">
          <FormLabel fontSize="xs" mr={1}>
            追加タイム補正
          </FormLabel>
          <Input
            name="time-offset"
            placeholder=""
            type="number"
            size="sm"
            step="0.05"
            min="-3"
            max="3"
            className="max-w-[70px]"
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            value={addTimeOffset}
            onChange={(e) => {
              setAddTimeOffset(Number(e.target.value));
              sendIndexedDB(e.target as HTMLInputElement);
            }}
          />
        </HStack>
      </CustomToolTip>
    </HStack>
  );
}
