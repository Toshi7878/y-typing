"use client";
import { Box, Button, useTheme } from "@chakra-ui/react";

import React from "react";
import { handleSignIn, handleSignOut } from "./authAction";
import { ThemeColors } from "@/types";

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
  const theme: ThemeColors = useTheme();
  return (
    <Box
      as="form"
      action={async () => {
        await handleSignOut();
        window.location.reload();
      }}
    >
      <Button
        type="submit"
        variant="link"
        fontSize="xs"
        color={theme.colors.header.color}
        _hover={{ color: theme.colors.header.hover.color }}
      >
        ログアウト
      </Button>
    </Box>
  );
}
