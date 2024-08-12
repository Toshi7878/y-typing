"use client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import Content from "./Content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTheme } from "../customTheme";
import { themeAtom } from "@/components/header/atom/atoms";
import { useAtomValue } from "jotai";
const queryClient = new QueryClient();

export default function Home() {
  const theme = useAtomValue(themeAtom);

  return (
    <ChakraProvider theme={getTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        <Box
          bg={"background"}
          className={`flex min-h-screen flex-col items-center justify-between pt-20`}
        >
          <Content />
        </Box>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
