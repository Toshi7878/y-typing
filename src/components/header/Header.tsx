import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import HeaderContent from "./HeaderContent";
import HeaderClientProvider from "./HeaderClientProvider";

// export const runtime = "edge";

const Header = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <HeaderClientProvider>
        <HeaderContent />
      </HeaderClientProvider>
    </SessionProvider>
  );
};

export default Header;
