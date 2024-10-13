import { ThemeColors } from "@/types";
import { Box, Text, useTheme } from "@chakra-ui/react";
import React from "react";

interface UserInputModeTextProps {
  kanaType: number;
  romaType: number;
  flickType: number;
}

export const UserInputModeText = (props: UserInputModeTextProps) => {
  const theme: ThemeColors = useTheme();

  const romaColor = theme.colors.type.ready.radio.roma.bg;
  const kanaColor = theme.colors.type.ready.radio.kana.bg;
  const flickColor = theme.colors.type.ready.radio.flick.bg;

  if (props.romaType && props.kanaType) {
    if (props.romaType >= props.kanaType) {
      return (
        <Box isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <Text as="span" color={romaColor} className="input-mode-outline-text">
            ローマ字
          </Text>
          <Text as="span" color={theme.colors.card.color}>
            ・
          </Text>
          <Text as="span" color={kanaColor} className="input-mode-outline-text">
            かな
          </Text>
        </Box>
      );
    } else {
      return (
        <>
          <Text as="span" color={kanaColor} className="input-mode-outline-text">
            かな
          </Text>
          <Text as="span" color={theme.colors.card.color}>
            ・
          </Text>
          <Text as="span" color={romaColor} className="input-mode-outline-text">
            ローマ字
          </Text>
        </>
      );
    }
  } else {
    if (props.romaType) {
      return (
        <Text as="span" color={romaColor} className="input-mode-outline-text">
          ローマ字
        </Text>
      );
    }
    if (props.kanaType) {
      return (
        <Text as="span" color={kanaColor} className="input-mode-outline-text">
          かな
        </Text>
      );
    }
  }
  return null;
};
