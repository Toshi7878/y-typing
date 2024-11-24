"use client";

import CustomDrawerContent from "@/components/custom-chakra-ui/CustomDrawerContent";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { ThemeColors } from "@/types";
import {
  Box,
  useTheme,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import NotifyDrawerInnerContent from "./child/NotifyDrawerInnerContent";

export default function NotifyBell() {
  const theme: ThemeColors = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Drawerの開閉状態を管理

  return (
    <>
      <CustomToolTip placement="bottom" tooltipLabel="通知" fontSize="xs" openDelay={600}>
        <Box
          color={theme.colors.text.header.normal}
          _hover={{
            color: theme.colors.text.header.hover,
          }}
          cursor="pointer"
          onClick={onOpen} // アイコンをクリックしたらDrawerを開く
        >
          <FaBell size={18} />
        </Box>
      </CustomToolTip>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <CustomDrawerContent width="400px">
          <NotifyDrawerInnerContent />
        </CustomDrawerContent>
      </Drawer>
    </>
  );
}
