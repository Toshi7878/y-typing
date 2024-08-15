"use client";

import { usePathname } from "next/navigation";
import { Box } from "@chakra-ui/react";
import SiteLogo from "./left-child/SiteLogo";
import LeftMenus from "./left-child/LeftMenus";
import { leftNavConfig } from "@/config/headerNav";

function LeftNav() {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <Box display="flex" gap={{ base: 0, md: 10 }} alignItems="center">
      <SiteLogo />
      <LeftMenus items={leftNavConfig.items} />
    </Box>
  );
}

export default LeftNav;
