import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Tooltip } from "../ui/tooltip";

interface CustomToolTipProps {
  tooltipLabel: string | ReactNode;
  children: ReactNode;
  placement: undefined;
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
  return (
    <Tooltip
      bg={"background.body"}
      color={"text.body"}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={"border.card"}
      css={{
        "--popper-arrow-bg": "background.body",
        "--popper-arrow-shadow-color": "border.card",
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
