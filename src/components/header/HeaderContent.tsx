"use client";
import LeftNav from "./child/LeftNav";
import RightNav from "./child/RightNav";
import { Box } from "@chakra-ui/react";

const HeaderContent = () => {
  return (
    <Box
      as="header"
      id="header"
      className="fixed w-full z-40"
      bg={"background.header"}
      width="100vw"
    >
      <Box
        width={{ base: "90%", xs: "100%", xl: "85%" }}
        className="container h-1 py-5 flex items-center justify-between"
      >
        <LeftNav />
        <RightNav />
      </Box>
    </Box>
  );
};

export default HeaderContent;
