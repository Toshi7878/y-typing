"use client";

import Login from "./right-child/login/Login";
import NewMap from "./right-child/new-map/NewMap";
import { useSession } from "next-auth/react";
import { Box } from "@chakra-ui/react";

export default function RightNav() {
  const { data: session } = useSession();

  return (
    <Box className="flex items-center gap-5 ">
      {session?.user?.name ? <NewMap /> : null}
      <Login />
    </Box>
  );
}
