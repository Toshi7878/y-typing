import { LocalClapState, ThemeColors } from "@/types";
import { Text, useTheme } from "@chakra-ui/react";
import React from "react";

interface ClapedTextProps {
  optimisticState: LocalClapState;
}

const ClapedText = (props: ClapedTextProps) => {
  const theme: ThemeColors = useTheme();
  return (
    <Text
      as="span"
      {...(props.optimisticState.hasClap && { color: theme.colors.semantic.clap })}
      className={`${props.optimisticState.hasClap ? "outline-text" : ""}`}
    >
      {props.optimisticState.clapCount}
    </Text>
  );
};

export default ClapedText;
