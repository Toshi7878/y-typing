import { ThemeColors } from "@/types";
import { Box, PlacementWithLogical, Tooltip, useTheme } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface CustomToolTipProps {
  tooltipLabel: string | ReactNode;
  children: ReactNode;
  placement: PlacementWithLogical | undefined;
  isDisabled?: boolean;
  isOpen?: boolean;
  fontSize?: "sm" | "md" | "lg";
}
const CustomToolTip = ({
  tooltipLabel,
  placement,
  isDisabled,
  isOpen,
  fontSize,
  children,
}: CustomToolTipProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Tooltip
      bg={theme.colors.background.body}
      color={theme.colors.text.body}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={theme.colors.border.card}
      css={{
        "--popper-arrow-bg": theme.colors.background.body,
        "--popper-arrow-shadow-color": theme.colors.border.card,
      }}
      hasArrow
      placement={placement}
      label={<Box whiteSpace="nowrap">{tooltipLabel}</Box>}
      isDisabled={isDisabled}
      isOpen={isOpen}
      fontSize={fontSize}
      minWidth="fit-content"
    >
      {children}
    </Tooltip>
  );
};

export default CustomToolTip;
