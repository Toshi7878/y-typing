"use client";
import { Textarea } from "@chakra-ui/react";
import { Dispatch } from "react";

interface CSSInputProps {
  CSSText: string;
  setCSSText: Dispatch<string>;
  setIsEditedCSS: Dispatch<boolean>;
}

export default function CSSInput(props: CSSInputProps) {
  return (
    <Textarea
      placeholder=""
      resize={"vertical"}
      size="md"
      height={"200px"}
      value={props.CSSText}
      onChange={(e) => {
        props.setCSSText(e.target.value);
        props.setIsEditedCSS(true);
      }}
    />
  );
}
