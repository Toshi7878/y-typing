import { ModalContent } from "@chakra-ui/react";
import React from "react";

interface CustomModalContentProps {
  children: React.ReactNode;
  maxW?: string;
}
const CustomModalContent = (props: CustomModalContentProps) => {
  return (
    <ModalContent bg={"popup.bg"} color={"popup.color"} maxW={props.maxW ? props.maxW : "auto"}>
      {props.children}
    </ModalContent>
  );
};

export default CustomModalContent;
