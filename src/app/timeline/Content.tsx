"use client";
import { Box } from "@chakra-ui/react";
import UsersResultList from "./components/UsersResultList";
import { useEffect } from "react";
import React from "react";

export default function Content() {
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
  }, []);

  return (
    <Box as="main" width={{ base: "100%", md: "90vw", "2xl": "65vw" }}>
      <UsersResultList />
    </Box>
  );
}
