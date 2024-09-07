import { ThemeColors } from "@/types";
import { PlacementWithLogical, Tooltip, useTheme } from "@chakra-ui/react";
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
      placement={placement}
      label={tooltipLabel}
      isDisabled={isDisabled}
      isOpen={isOpen}
      fontSize={fontSize}
    >
      {children}
    </Tooltip>
  );
};

export default CustomToolTip;
