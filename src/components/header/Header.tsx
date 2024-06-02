import React from "react";
import MainNav from "./MainNav";
import { marketingConfig } from "@/config/marketing";
import Login from "./login/Login";
import { SessionProvider } from "next-auth/react";
// export const runtime = "edge";

const Header = () => {
  return (
    <SessionProvider>
      <header className="fixed w-full z-40 bg-background border-b-2">
        <div className="container md:max-w-[50rem] h-1 py-5 flex items-center justify-between">
          {" "}
          {/* h-1 py-6 から h-1 py-4 に変更 */}
          <MainNav items={marketingConfig.mainNav} />
          <Login />
        </div>
      </header>
    </SessionProvider>
  );
};

export default Header;
