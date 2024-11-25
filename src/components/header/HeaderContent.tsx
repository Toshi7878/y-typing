"use client";
import LeftNav from "./child/left-child/LeftNav";
import RightNav from "./child/RightNav";
import { Flex, Box } from "@chakra-ui/react";
import HamburgerMenu from "./hamburger-menu/HamburgerMenu";

const HeaderContent = () => {
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
        <HamburgerMenu display={{ base: "flex", md: "none" }} />
      </Flex>
    </Box>
  );
};

export default HeaderContent;
