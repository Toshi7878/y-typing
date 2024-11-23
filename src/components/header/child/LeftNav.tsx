"use client";

import { Flex } from "@chakra-ui/react";
import SiteLogo from "./left-child/SiteLogo";
import LeftMenus from "./left-child/LeftMenus";

function LeftNav() {
  return (
    <Flex gap={10} alignItems="center">
      <SiteLogo />
      <LeftMenus />
    </Flex>
  );
}

export default LeftNav;
