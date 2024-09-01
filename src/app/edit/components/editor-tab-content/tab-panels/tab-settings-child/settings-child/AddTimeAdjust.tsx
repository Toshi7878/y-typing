"use client";
import { FormLabel, Input, HStack, Box, useTheme, Tooltip } from "@chakra-ui/react";
import { IndexDBOption, ThemeColors } from "@/types";
import { DEFAULT_ADD_ADJUST_TIME } from "@/app/edit/ts/const/editDefaultValues";
import { FieldValues, UseFormRegister } from "react-hook-form";
import {
  useEditAddTimeOffsetAtom,
  useSetEditAddTimeOffsetAtom,
} from "@/app/edit/edit-atom/editAtom";

interface AddTimeAdjustProps {
  sendIndexedDB: (target: HTMLInputElement) => void;
}

export default function AddTimeAdjust(props: AddTimeAdjustProps) {
  const theme: ThemeColors = useTheme();

  const addTimeOffset = useEditAddTimeOffsetAtom();
  const setAddTimeOffset = useSetEditAddTimeOffsetAtom();

  return (
    <HStack alignItems="baseline">
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
        placement="top"
        label={<Box>再生中に追加ボタンを押した時に、数値分のタイムを調整します</Box>}
      >
        <HStack alignItems="baseline">
          <FormLabel fontSize="sm">追加タイム補正</FormLabel>
          <Input
            name="time-offset"
            placeholder=""
            type="number"
            size="md"
            step="0.05"
            min="-3"
            max="3"
            className="max-w-[70px]"
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            value={addTimeOffset}
            onChange={(e) => {
              setAddTimeOffset(Number(e.target.value));
              props.sendIndexedDB(e.target as HTMLInputElement);
            }}
          />
        </HStack>
      </Tooltip>
    </HStack>
  );
}
