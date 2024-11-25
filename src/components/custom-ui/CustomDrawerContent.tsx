import { ThemeColors } from "@/types";
import { DrawerContent, DrawerOverlay, useTheme } from "@chakra-ui/react";
import React from "react";

interface CustomDrawerContentProps {
  width?: string;
  children: React.ReactNode;
}

const CustomDrawerContent = ({ children, width = "auto" }: CustomDrawerContentProps) => {
  const theme: ThemeColors = useTheme();
  return (
    <>
      <DrawerOverlay />
      <DrawerContent minW={width} bg={theme.colors.background.body} color={theme.colors.text.body}>
        {children}
      </DrawerContent>
    </>
  );
};

export default CustomDrawerContent;
