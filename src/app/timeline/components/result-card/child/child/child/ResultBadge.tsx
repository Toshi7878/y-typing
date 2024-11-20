import { ThemeColors } from "@/types";
import { Badge, useTheme } from "@chakra-ui/react";
import React from "react";

interface ResultBadgeProps {
  letterSpacing?: number;
  color: string;
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
      // bg={theme.colors.home.badge.info.bg}
      color={props.color}
      // borderColor={theme.colors.home.badge.info.borderColor}
    >
      {props.children}
    </Badge>
  );
};

export default ResultBadge;
