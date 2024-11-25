"use client";

import CustomDrawerContent from "@/components/custom-ui/CustomDrawerContent";
import CustomToolTip from "@/components/custom-ui/CustomToolTip";
import { ThemeColors } from "@/types";
import { Box, useTheme, Drawer, useDisclosure } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import NotifyDrawerInnerContent from "./child/NotifyDrawerInnerContent";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/consts";

export default function NotifyBell() {
  const theme: ThemeColors = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Drawerの開閉状態を管理
  const queryClient = useQueryClient();

  const nofityDrawerClose = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification });
    onClose();
  };
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

      <Drawer isOpen={isOpen} placement="right" onClose={nofityDrawerClose}>
        <CustomDrawerContent width={{ base: "auto", lg: "450px" }}>
          <NotifyDrawerInnerContent />
        </CustomDrawerContent>
      </Drawer>
    </>
  );
}
