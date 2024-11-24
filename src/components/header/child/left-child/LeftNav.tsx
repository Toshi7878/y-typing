"use client";

import { Flex } from "@chakra-ui/react";
import SiteLogo from "./SiteLogo";
import LeftMenus from "./LeftMenus";

function LeftNav() {
  return (
    <Flex gap={10} alignItems="center">
      <SiteLogo />
      <LeftMenus />
    </Flex>
  );
}

export default LeftNav;
