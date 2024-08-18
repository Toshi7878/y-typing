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
        <Text as="span" data-list-number={index}>
          {lineCount}/{map!.lineLength}
        </Text>
        <Text as="span" mx={2}>
          {"|"}
        </Text>
        <Tooltip
          label={`ライン打鍵数${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
          placement="top"
          fontSize="sm"
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px solid"
          borderColor={theme.colors.type.card.borderColor}
        >
          <Text
            as="span"
            _hover={{ bg: `${theme.colors.type.card.borderColor}30` }}
            className="line-notes"
          >
            {lineNotes}打
          </Text>
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
          <Text
            as="span"
            _hover={{ bg: `${theme.colors.type.card.borderColor}30` }}
            className="line-time"
          >
            {lineTime.toFixed(1)}秒
          </Text>
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
          <Text
            as="span"
            className="line-kpm"
            _hover={{ bg: `${theme.colors.type.card.borderColor}30` }}
          >
            {lineKpm.toFixed(0)}kpm {lineSpeed > 1 && <>{`(${lineSpeed.toFixed(2)}倍速)`}</>}
          </Text>
        </Tooltip>
      </Box>
    </CardHeader>
  );
}

export default memo(ResultCardHeader);
