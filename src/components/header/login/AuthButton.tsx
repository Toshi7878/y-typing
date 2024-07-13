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
  const isLocal = process.env.NODE_ENV === "development";

  return (
    <form action={handleSignIn}>
      {isLocal ? (
        <Button type="submit" variant="link" size="sm" {...props}>
          ログイン
        </Button>
      ) : (
        <Button type="submit" variant="link" size="sm" {...props}>
          ログイン
        </Button>
      )}
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
