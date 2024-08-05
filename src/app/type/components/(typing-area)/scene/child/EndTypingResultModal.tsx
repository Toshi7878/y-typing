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
import { memo, useEffect, useRef, useState } from "react";
import ResultLineList from "./child/ResultLineList";

interface EndTypingResultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function EndTypingResultDrawer({ isOpen, onClose }: EndTypingResultDrawerProps) {
  const [drawerHeight, setDrawerHeight] = useState("100vh");
  const modalContentRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      setDrawerHeight(`${window.innerHeight}px`);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  console.log("drawer Open");
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay backgroundColor="transparent" />
      <DrawerContent height={drawerHeight} backgroundColor="rgba(255, 255, 255, 0.8)">
        <DrawerHeader fontSize="md" py={2}>
          タイピングリザルト
        </DrawerHeader>
        <DrawerCloseButton tabIndex={-1} autoFocus={false} />
        <DrawerBody overflowY="auto" position="relative" ref={modalContentRef}>
          <ResultLineList modalContentRef={modalContentRef} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default memo(EndTypingResultDrawer);
