import { signIn, signOut } from "@/lib/auth";
import { Button } from "@chakra-ui/react";


import React from "react";

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
      <Button type="submit" colorScheme="blue" size="sm" {...props}>
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
