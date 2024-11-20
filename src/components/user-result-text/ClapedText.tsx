import { ThemeColors } from "@/types";
import { Text, useTheme } from "@chakra-ui/react";
import React from "react";

interface ClapedTextProps {
  hasClap: boolean;
  localClapCount: number;
}

const ClapedText = (props: ClapedTextProps) => {
  const theme: ThemeColors = useTheme();
  return (
    <Text
      as="span"
      {...(props.hasClap && { color: theme.colors.semantic.clap })}
      className={`${props.hasClap ? "outline-text" : ""}`}
    >
      {props.localClapCount}
    </Text>
  );
};

export default ClapedText;
