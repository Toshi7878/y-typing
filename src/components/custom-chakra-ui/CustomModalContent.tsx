import { ThemeColors } from "@/types";
import { ModalContent, useTheme } from "@chakra-ui/react";
import React from "react";

interface CustomModalContentProps {
  children: React.ReactNode;
  maxW?: string;
}
const CustomModalContent = (props: CustomModalContentProps) => {
  const theme: ThemeColors = useTheme();
  return (
    <ModalContent
      bg={"background.body"}
      color={"text.body"}
      maxW={props.maxW ? props.maxW : "auto"}
    >
      {props.children}
    </ModalContent>
  );
};

export default CustomModalContent;
