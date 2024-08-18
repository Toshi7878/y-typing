"use client";
import { mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { InputModeType } from "@/app/type/(ts)/type";
import { ThemeColors } from "@/types";
import { Box, Text, CardHeader, Tooltip, useTheme } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { memo } from "react";

interface ResultCardHeaderdProps {
  index: number;
  lineCount: number;
  lineNotes: number;
  lineInputMode: InputModeType;
  lineTime: number;
  lineKpm: number;
  lineSpeed: number;
}

function ResultCardHeader({
  index,
  lineCount,
  lineNotes,
  lineInputMode,
  lineTime,
  lineKpm,
  lineSpeed,
}: ResultCardHeaderdProps) {
  const map = useAtomValue(mapAtom);
  const theme: ThemeColors = useTheme();

  return (
    <CardHeader py={0}>
      <Box>
        <Text as="span" data-list-number={index} mr={2}>
          {lineCount}/{map!.lineLength}
        </Text>{" "}
        <Tooltip
          label={`ライン打鍵数${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
          placement="top"
          fontSize="sm"
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px solid"
          borderColor={theme.colors.type.card.borderColor}
        >
          <span className="line-notes">{lineNotes}打</span>
        </Tooltip>
        ÷{" "}
        <Tooltip
          label="ライン時間"
          placement="top"
          fontSize="sm"
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px solid"
          borderColor={theme.colors.type.card.borderColor}
        >
          <span className="line-time">{lineTime.toFixed(1)}秒</span>
        </Tooltip>
        ={" "}
        <Tooltip
          label={`要求打鍵速度${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
          placement="top"
          fontSize="sm"
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px solid"
          borderColor={theme.colors.type.card.borderColor}
        >
          <span className="line-kpm">
            {lineKpm.toFixed(0)}kpm {lineSpeed > 1 && <>{`(${lineSpeed.toFixed(2)}倍速)`}</>}
          </span>
        </Tooltip>
      </Box>
    </CardHeader>
  );
}

export default memo(ResultCardHeader);
