import { UseDisclosureReturn } from "@chakra-ui/react";

export const useToggleLineList = () => {
  return (drawerClosure: UseDisclosureReturn) => {
    const { isOpen, onOpen, onClose } = drawerClosure;
    if (!isOpen) {
      onOpen();
    } else {
      onClose();
    }
  };
};
