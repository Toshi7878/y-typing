import { ThemeColors } from "@/types";
import { Badge, useTheme } from "@chakra-ui/react";
import React from "react";

interface ResultBadgeProps {
  letterSpacing?: number;
  color: string;
  borderColor: string;
  children: React.ReactNode;
}

const ResultBadge = (props: ResultBadgeProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Badge
      className="min-w-[97.55px] lg:text-lg"
      borderRadius="lg"
      fontSize="lg"
      textAlign="center"
      border="solid 1px"
      textTransform="none"
      letterSpacing={props.letterSpacing}
      bg={props.borderColor}
      color={props.color}
      borderColor={theme.colors.border.badge}
    >
      {props.children}
    </Badge>
  );
};

export default ResultBadge;
