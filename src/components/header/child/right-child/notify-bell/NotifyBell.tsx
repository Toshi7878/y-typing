"use client";
import CustomDrawerContent from "@/components/custom-ui/CustomDrawerContent";
import CustomToolTip from "@/components/custom-ui/CustomToolTip";
import { ThemeColors } from "@/types";
import { Box, useTheme, Drawer, useDisclosure } from "@chakra-ui/react";
import NotifyDrawerInnerContent from "./child/NotifyDrawerInnerContent";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/consts";
import { Bell, BellDot } from "lucide-react";
import { useCallback, useState } from "react";

interface NotifyBellProps {
  isNewNotification: boolean;
}

export default function NotifyBell({ isNewNotification }: NotifyBellProps) {
  const [isNewBadge, isSetNewBadge] = useState(isNewNotification);
  const theme: ThemeColors = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Drawerの開閉状態を管理
  const queryClient = useQueryClient();

  const nofityDrawerClose = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification });
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificationOpen = useCallback(() => {
    isSetNewBadge(false);
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <CustomToolTip placement="bottom" tooltipLabel="通知" fontSize="xs" openDelay={600}>
        <Box
          color={theme.colors.text.header.normal}
          _hover={{
            color: theme.colors.text.header.hover,
          }}
          cursor="pointer"
          onClick={notificationOpen}
        >
          <Box position="relative" top="0.5px" boxShadow="xl">
            {isNewBadge ? (
              <BellDot size={18} strokeWidth={2.5} />
            ) : (
              <Bell size={18} strokeWidth={2.5} />
            )}
          </Box>
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
