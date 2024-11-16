import { Text } from "@chakra-ui/react";
import React from "react";

interface ClapedTextProps {
  hasClap: boolean;
  clapCount: number;
}

const ClapedText = (props: ClapedTextProps) => {
  return (
    <Text
      as="span"
      {...(props.hasClap && { color: "#ffb825" })}
      className={`${props.hasClap ? "outline-text" : ""}`}
    >
      {props.clapCount}
    </Text>
  );
};

export default ClapedText;
