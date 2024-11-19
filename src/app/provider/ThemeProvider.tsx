"use client";
import { getTheme } from "@/lib/customTheme";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";

const ThemeProvider = ({ children }: { colorMode?: any; children: React.ReactNode }) => {
  // const themeColor = useAtomValue(themeAtom);
  const theme = getTheme("dark");

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
      <style>
        {`#nprogress .bar {
          background:${theme.colors.type.progress.bg};
      }`}
      </style>
    </>
  );
};

export default ThemeProvider;
