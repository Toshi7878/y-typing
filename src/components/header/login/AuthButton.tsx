import { signIn, signOut } from "@/lib/auth";
import { Button } from "@chakra-ui/react";

import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

export function SignIn({
  provider,

  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  const handleSignIn = async () => {
    "use server";
    await signIn(provider);
  };

  return (
    <form action={handleSignIn}>
      <Button type="submit" {...props}>
        ログイン
      </Button>
    </form>
  );
}

export function SignOut({ name }: { name: string }) {
  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <form action={handleSignOut}>
      <Button type="submit">ログアウト</Button>
    </form>
  );
}
