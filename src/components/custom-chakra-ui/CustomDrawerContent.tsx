import { ThemeColors } from "@/types";
import { DrawerContent, DrawerOverlay, useTheme } from "@chakra-ui/react";
import React from "react";

const CustomDrawerContent = ({ children }) => {
  const theme: ThemeColors = useTheme();
  return (
    <>
      <DrawerOverlay />
      <DrawerContent bg={theme.colors.background.body} color={theme.colors.text.body}>
        {children}
      </DrawerContent>
    </>
  );
};

export default CustomDrawerContent;
