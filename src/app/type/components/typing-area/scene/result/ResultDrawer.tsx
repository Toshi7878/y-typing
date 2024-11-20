"use client";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useTheme,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import ResultLineList from "./child/ResultLineList";

interface ResultDrawerProps {
  drawerClosure: UseDisclosureReturn;
}

function ResultDrawer({ drawerClosure }: ResultDrawerProps) {
  const { isOpen, onClose } = drawerClosure;
  const [drawerHeight, setDrawerHeight] = useState("100vh");
  const modalContentRef = useRef(null);
  const theme = useTheme();

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
      <DrawerContent height={drawerHeight} backgroundColor={`${theme.colors.background.body}dd`}>
        <DrawerHeader fontSize="md" py={2} color={theme.colors.textColor.body}>
          タイピングリザルト
        </DrawerHeader>
        <DrawerCloseButton
          tabIndex={-1}
          autoFocus={false}
          mr={5}
          color={theme.colors.textColor.body}
        />
        <DrawerBody overflowY="auto" position="relative" ref={modalContentRef}>
          <ResultLineList modalContentRef={modalContentRef} onClose={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default memo(ResultDrawer);
