"use client";
import LeftNav from "./child/left-child/LeftNav";
import RightNav from "./child/RightNav";
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Flex,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import HamburgerMenu from "./hamburger-menu/HamburgerMenu";

const HeaderContent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as="header"
      id="header"
      position="fixed"
      zIndex={40}
      bg={"background.header"}
      width="100vw"
    >
      <Flex
        width={{ base: "90%", md: "80%" }}
        mx="auto"
        height={10}
        alignItems="center"
        justifyContent="space-between"
      >
        <LeftNav />
        <RightNav display={{ base: "none", md: "flex" }} />

        <HamburgerMenu display={{ base: "block", md: "none" }} />
      </Flex>
    </Box>
  );
};

export default HeaderContent;
