import React from "react";
import { SessionProvider } from "next-auth/react";
import HeaderContent from "./HeaderContent";
import { auth } from "@/lib/auth";
// export const runtime = "edge";

const Header = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <HeaderContent />
    </SessionProvider>
  );
};

export default Header;
