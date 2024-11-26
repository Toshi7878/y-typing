"use client";

import Login from "./right-child/login/Login";
import NewMap from "./right-child/new-map/NewMap";
import { useSession } from "next-auth/react";
import { Flex, ResponsiveValue } from "@chakra-ui/react";
import NotifyBell from "./right-child/notify-bell/NotifyBell";

interface RightNavProps {
  display?: ResponsiveValue<string>;
  isNewNotification: boolean;
}

export default function RightNav({ display, isNewNotification }: RightNavProps) {
  const { data: session } = useSession();

  return (
    <Flex display={display} alignItems={"center"} gap={5}>
      {session?.user?.id && (
        <>
          <NotifyBell isNewNotification={isNewNotification} />
          <NewMap />
        </>
      )}
      <Login />
    </Flex>
  );
}
