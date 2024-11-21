"use client";
import { getTheme } from "@/theme";
import { ThemeColors } from "@/types";
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
	  background:${theme.colors.primary.normal};
  }`}
      </style>
    </>
  );
};

export default ThemeProvider;
