"use client";
import { Button } from "@chakra-ui/react";

import React from "react";
import { handleSignIn, handleSignOut } from "./authAction";

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
  return (
    <form action={() => handleSignIn(provider)}>
      <Button leftIcon={icon} type="submit" variant="">
        {buttonText}
      </Button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        await handleSignOut();

        window.location.reload();
      }}
    >
      <Button type="submit">ログアウト</Button>
    </form>
  );
}
