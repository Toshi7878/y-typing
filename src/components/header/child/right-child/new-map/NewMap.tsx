"use client";

import { ThemeColors } from "@/types";
import { useDisclosure, Box, useTheme } from "@chakra-ui/react";
import { MdAddBox } from "react-icons/md";
import NewCreateModal from "./child/NewCreateModal";

export default function NewMap() {
  const newCreateModalDisclosure = useDisclosure();

  const theme: ThemeColors = useTheme();

  return (
    <>
      <Box
        color={theme.colors.header.color}
        _hover={{
          color: theme.colors.header.hover.color,
        }}
        className="cursor-pointer text-xl"
        onClick={newCreateModalDisclosure.onOpen}
      >
        <MdAddBox />
      </Box>

      {newCreateModalDisclosure.isOpen && (
        <NewCreateModal newCreateModalDisclosure={newCreateModalDisclosure} />
      )}
    </>
  );
}
