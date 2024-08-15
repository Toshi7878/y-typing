"use client";
import { Box, Button } from "@chakra-ui/react";

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
    <Box as="form" action={() => handleSignIn(provider)}>
      <Button leftIcon={icon} type="submit" variant="">
        {buttonText}
      </Button>
    </Box>
  );
}

export function SignOut() {
  return (
    <Box
      as="form"
      action={async () => {
        await handleSignOut();
        window.location.reload();
      }}
    >
      <Button type="submit" variant="unstyled" colorScheme="red">
        ログアウト
      </Button>
    </Box>
  );
}
