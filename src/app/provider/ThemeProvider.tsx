"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import { useAtomValue } from "jotai";
import { themeAtom } from "@/components/atom/globalAtoms";
import { getTheme } from "../../lib/customTheme";

const ThemeProvider = ({ children }: { colorMode?: any; children: React.ReactNode }) => {
  const themeColor = useAtomValue(themeAtom);
  const theme = getTheme(themeColor);

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
