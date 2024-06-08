import React from "react";
import LeftNav from "./LeftNav";
import { leftNavConfig } from "@/config/headerNav";
import { SessionProvider } from "next-auth/react";
import RightNav from "./RightNav";
// export const runtime = "edge";

const Header = () => {
  return (
    <SessionProvider>
      <header className="fixed w-full z-40 bg-background border-b-2">
        <div className="container md:max-w-[50rem] h-1 py-5 flex items-center justify-between">
          <LeftNav items={leftNavConfig.mainNav} />
          <RightNav />
        </div>
      </header>
    </SessionProvider>
  );
};

export default Header;
