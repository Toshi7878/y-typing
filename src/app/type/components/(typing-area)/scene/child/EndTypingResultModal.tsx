"use client";
import { LineResultData } from "@/app/type/(ts)/type";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { memo } from "react";
import LineResultList from "./child/LineResultList";

interface EndTypingResultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  typingLineResults?: LineResultData[];
}

function EndTypingResultDrawer({ isOpen, onClose, typingLineResults }: EndTypingResultDrawerProps) {
  console.log("drawer Open");
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay backgroundColor="transparent" />
      <DrawerContent backgroundColor="rgba(255, 255, 255, 0.8)">
        <DrawerHeader fontSize="md" py={2}>
          タイピングリザルト
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <LineResultList typingLineResults={typingLineResults!} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default memo(EndTypingResultDrawer);
