"use client";

import { ThemeColors } from "@/types";
import { Box, Text, Tooltip, Stack, useTheme } from "@chakra-ui/react";
import { memo } from "react";
interface ResultCardFooterProps {
  scoreCount?: number;
  point: number;
  tBonus: number;
  maxLinePoint: number;
  lMiss: number;
  kpm: number;
  rkpm: number;
}

function ResultCardFooter({
  scoreCount,
  point,
  tBonus,
  maxLinePoint,
  lMiss,
  kpm,
  rkpm,
}: ResultCardFooterProps) {
  const theme: ThemeColors = useTheme();

  return (
    <Stack>
      <Box>
        miss: {lMiss},{" "}
        <Tooltip
          label={`rkpm:${rkpm}`}
          placement="top"
          fontSize="sm"
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px solid"
          borderColor={theme.colors.type.card.borderColor}
        >
          <Text as="span" _hover={{ bg: `${theme.colors.type.card.borderColor}30` }}>
            kpm: {kpm}
          </Text>
        </Tooltip>
        ,{" "}
        <Tooltip
          label={`sumPoint: ${Number(point) + Number(tBonus)}${scoreCount ? ` Score: ${scoreCount}` : ""}`}
          placement="top"
          fontSize="sm"
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px solid"
          borderColor={theme.colors.type.card.borderColor}
        >
          <Text as="span" _hover={{ bg: `${theme.colors.type.card.borderColor}30` }}>
            point: {point}
            {tBonus ? `+${tBonus}` : ""} / {maxLinePoint}
          </Text>
        </Tooltip>
      </Box>
    </Stack>
  );
}

export default memo(ResultCardFooter);
