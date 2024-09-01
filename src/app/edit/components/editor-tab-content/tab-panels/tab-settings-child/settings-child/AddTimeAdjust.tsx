"use client";
import { FormLabel, Input, HStack, Box, useTheme, Tooltip } from "@chakra-ui/react";
import { IndexDBOption, ThemeColors } from "@/types";
import { DEFAULT_ADJUST_TIME } from "@/app/edit/ts/const/defaultValues";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface AddTimeAdjustProps {
  register: UseFormRegister<FieldValues>;
  optionsData: IndexDBOption | undefined;
  sendIndexedDB: (target: HTMLInputElement) => void;
}

export default function AddTimeAdjust(props: AddTimeAdjustProps) {
  const theme: ThemeColors = useTheme();

  return (
    <HStack alignItems="baseline">
      <Tooltip label={<Box>追加ボタンを押した時に、数値分のタイムを調整します</Box>}>
        <HStack alignItems="baseline">
          <FormLabel fontSize="sm">追加タイム調整</FormLabel>
          <Input
            {...props.register("time-offset", {
              value: props.optionsData?.["time-offset"] ?? DEFAULT_ADJUST_TIME,
            })}
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
            onChange={(e) => props.sendIndexedDB(e.target as HTMLInputElement)}
          />
        </HStack>
      </Tooltip>
    </HStack>
  );
}
