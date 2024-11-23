"use client";

import Login from "./right-child/login/Login";
import NewMap from "./right-child/new-map/NewMap";
import { useSession } from "next-auth/react";
import { Box, Flex, ResponsiveValue } from "@chakra-ui/react";

interface RightNavProps {
  display?: ResponsiveValue<string>;
}

export default function RightNav({ display }: RightNavProps) {
  const { data: session } = useSession();

  return (
    <Flex display={display} alignItems={"center"} gap={5}>
      {session?.user?.name ? <NewMap /> : null}
      <Login />
    </Flex>
  );
}
