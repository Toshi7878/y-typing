"use client";
import { Box } from "@chakra-ui/react";
import Content from "./Content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box
        as="main"
        bg={"background"}
        className={`flex min-h-screen flex-col items-center justify-between pt-20`}
      >
        <Content />
      </Box>
    </QueryClientProvider>
  );
}
