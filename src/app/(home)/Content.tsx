"use client";
import { Box } from "@chakra-ui/react";
import MapList from "./components/MapList";
import { useEffect } from "react";
import React from "react";
import SearchContent from "./components/SearchContent";

export default function Content() {
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
  }, []);

  return (
    <Box
      as="main"
      minH="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      pt={16}
    >
      <Box width={{ base: "100%", md: "92vw", "2xl": "82vw" }}>
        <SearchContent />
        <MapList />
      </Box>
    </Box>
  );
}
