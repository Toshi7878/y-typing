"use client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import Content from "./Content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTheme } from "../customTheme";
const queryClient = new QueryClient();

export default function Home() {
  return (
    <ChakraProvider theme={getTheme("dark")}>
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
