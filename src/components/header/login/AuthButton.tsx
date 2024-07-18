import { signIn, signOut } from "@/lib/auth";
import { Button } from "@chakra-ui/react";

import React from "react";

interface SignInProps {
  provider: string;
  buttonText: string;
  icon: React.ReactElement;
}
export function SignIn({
  provider,
  buttonText,
  icon,
}: SignInProps & React.ComponentPropsWithRef<typeof Button>) {
  const handleSignIn = async () => {
    "use server";
    await signIn(provider);
  };
  // const isLocal = process.env.NODE_ENV === "development";

  return (
    <form action={handleSignIn}>
      <Button leftIcon={icon} type="submit" variant="">
        {buttonText}
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
