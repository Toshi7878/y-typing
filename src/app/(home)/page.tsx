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
        minH="100vw"
        width={"100vw"}
        bg={"background"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        pt={20}
      >
        <Content />
      </Box>
    </QueryClientProvider>
  );
}
