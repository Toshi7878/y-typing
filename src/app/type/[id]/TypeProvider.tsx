import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { RefsProvider } from "../type-contexts/refsProvider";

const TypeProvider = async ({ children }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <RefsProvider>{children}</RefsProvider>
    </SessionProvider>
  );
};

export default TypeProvider;
