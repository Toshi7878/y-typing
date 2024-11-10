import { ModalContent } from "@chakra-ui/react";
import React from "react";

const CustomModalContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalContent bg={"popup.bg"} color={"popup.color"}>
      {children}
    </ModalContent>
  );
};

export default CustomModalContent;
