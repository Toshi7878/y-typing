import { SignIn, SignOut } from "./AuthButton";
import { Avatar, AvatarBadge, Box, MenuItem } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, Button, HStack } from "@chakra-ui/react";
import { CheckName } from "./CheckName";
import { BsDiscord } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Menu>
        <MenuButton as={Button} variant="link" fontSize="sm">
          ログイン
        </MenuButton>
        <MenuList>
          <MenuItem _hover={{ bg: "#7289DA", color: "white" }}>
            <SignIn
              provider="discord"
              buttonText={"Discordでログイン"}
              icon={<BsDiscord size="1.5em" />}
            />
          </MenuItem>
          <MenuItem _hover={{ bg: "#DB4437", color: "white" }}>
            <SignIn
              provider="google"
              buttonText={"Googleでログイン"}
              icon={<BsGoogle size="1.5em" />}
            />
          </MenuItem>
        </MenuList>
      </Menu>
    );
  } else {
    return (
      <div>
        <Menu>
          <MenuButton as={"button"} className="hover:bg-slate-400">
            <HStack spacing="3">
              <Box suppressHydrationWarning={true} color={"color"}>
                {session.user.name}
              </Box>
              <Avatar size="sm" name={session.user.name ?? ""} src={session.user.image ?? ""}>
                {!session.user.image && <AvatarBadge boxSize="1.25em" bg="gray.300" />}
              </Avatar>
            </HStack>
          </MenuButton>
          <MenuList className="p-0">
            <SignOut />
            <CheckName name={session.user.name ?? ""} />
          </MenuList>
        </Menu>
      </div>
    );
  }
}
