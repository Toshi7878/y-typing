"use client";
import { getTheme } from "@/lib/customTheme";
import { ChakraProvider, ThemeOverride } from "@chakra-ui/react";
import React from "react";

interface ThemeProviderProps {
  // theme: ThemeOverride;
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = getTheme("dark");
  return (
    <>
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
