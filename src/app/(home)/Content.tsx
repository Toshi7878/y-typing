"use client";
import { Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapList from "./MapList";

const queryClient = new QueryClient();

export default function Content() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box className="grid md:grid-cols-1 lg:grid-cols-2 gap-3">
        <MapList />
      </Box>
    </QueryClientProvider>
  );
}
