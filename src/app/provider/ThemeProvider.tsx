"use client";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

interface ThemeProviderProps {
  // theme: ThemeOverride;
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
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
