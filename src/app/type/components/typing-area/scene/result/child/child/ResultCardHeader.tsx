"use client";
import { InputModeType } from "@/app/type/ts/type";
import { ThemeColors } from "@/types";
import { Box, Text, useTheme } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { memo } from "react";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { useMapAtom } from "@/app/type/type-atoms/gameRenderAtoms";

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
  const map = useMapAtom();
  const theme: ThemeColors = useTheme();

  return (
    <Box>
      <Text as="span" data-list-number={index}>
        {lineCount}/{map!.lineLength}
      </Text>
      <Text as="span" mx={2}>
        {"|"}
      </Text>
      <CustomToolTip
        tooltipLabel={`ライン打鍵数${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
        placement="top"
        fontSize="sm"
      >
        <Text as="span" _hover={{ bg: `${"border.card"}30` }} className="line-notes">
          {lineNotes}打
        </Text>
      </CustomToolTip>
      ÷{" "}
      <CustomToolTip tooltipLabel="ライン時間" placement="top" fontSize="sm">
        <Text as="span" _hover={{ bg: `${"border.card"}30` }} className="line-time">
          {lineTime.toFixed(1)}秒
        </Text>
      </CustomToolTip>
      ={" "}
      <CustomToolTip
        tooltipLabel={`要求打鍵速度${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
        placement="top"
        fontSize="sm"
      >
        <Text as="span" className="line-kpm" _hover={{ bg: `${"border.card"}30` }}>
          {lineKpm.toFixed(0)}kpm {lineSpeed > 1 && <>{`(${lineSpeed.toFixed(2)}倍速)`}</>}
        </Text>
      </CustomToolTip>
    </Box>
  );
}

export default memo(ResultCardHeader);
