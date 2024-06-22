import { SignIn, SignOut } from "./AuthButton";
import { auth } from "../../../lib/auth";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, Button, HStack } from "@chakra-ui/react";
import { CheckName } from "./CheckName";

export default async function Login() {
  const session = await auth();

  if (!session?.user) {
    return (
      <nav>
        <SignIn provider="google" />
      </nav>
    );
  } else {
    return (
      <div>
        <Menu>
          <MenuButton as={"button"} className="hover:bg-slate-400">
            <HStack spacing="3">
              <div suppressHydrationWarning={true}>{session.user.name}</div>
              <Avatar size="sm" name={session.user.name ?? ""} src={session.user.image ?? ""}>
                {!session.user.image && <AvatarBadge boxSize="1.25em" bg="gray.300" />}
              </Avatar>
            </HStack>
          </MenuButton>
          <MenuList className="p-0">
            <SignOut name={session.user.name ?? ""} />
            <CheckName name={session.user.name ?? ""} />
          </MenuList>
        </Menu>
      </div>
    );
  }
}
