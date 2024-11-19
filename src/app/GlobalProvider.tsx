"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React, { useLayoutEffect } from "react";
import { useAtomValue } from "jotai";
import { getGlobalAtomStore, themeAtom, volumeAtom } from "@/components/atom/globalAtoms";
import { getTheme } from "./customTheme";
import { Provider as JotaiProvider } from "jotai";
import { db } from "@/lib/db";

export const GlobalProvider = ({ children }: { colorMode?: any; children: React.ReactNode }) => {
  const themeColor = useAtomValue(themeAtom);
  const theme = getTheme(themeColor);
  const globalAtomStore = getGlobalAtomStore();

  useLayoutEffect(() => {
    const getUserVolume = async () => {
      try {
        const entry = await db.globalOption.where("optionName").equals("volume-range").first();

        if (entry) {
          globalAtomStore.set(volumeAtom, Number(entry.value));
        }
        const volumeRange = Number(entry?.value); // volume-rangeキーのみを取得

        return volumeRange;
      } catch (error) {
        console.error("Error fetching volume range:", error);
      }
    };
    getUserVolume();
  }, []);
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <JotaiProvider store={globalAtomStore}>{children}</JotaiProvider>
      </ChakraProvider>
      <style>
        {`#nprogress .bar {
          background:${theme.colors.type.progress.bg};
      }`}
      </style>
    </>
  );
};
