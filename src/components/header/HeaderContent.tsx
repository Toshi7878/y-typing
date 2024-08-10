"use client";
import React from "react";
import LeftNav from "./LeftNav";
import { leftNavConfig } from "@/config/headerNav";
import RightNav from "./RightNav";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/app/customTheme";

const HeaderContent = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box id="header" className="fixed w-full z-40" bg={"header.bg"}>
        <Box className="container md:max-w-[80rem] h-1 py-5 flex items-center justify-between">
          <LeftNav items={leftNavConfig.mainNav} />
          <RightNav />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default HeaderContent;
