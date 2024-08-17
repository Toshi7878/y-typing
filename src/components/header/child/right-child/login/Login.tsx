import { SignIn, SignOut } from "./AuthButton";
import { Box, MenuDivider, MenuItem, useTheme } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, Button } from "@chakra-ui/react";
import { CheckName } from "./CheckName";
import { BsDiscord } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { ThemeColors } from "@/types";
import { handleSignOut } from "./authAction";
import LinkMenuItem from "../../child/LinkMenuItem";
import { loginMenuItem } from "@/config/headerNav";

export default function Login() {
  const { data: session } = useSession();
  const theme: ThemeColors = useTheme();

  const submitSignOut = async () => {
    await handleSignOut();
    window.location.reload();
  };

  if (!session?.user) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          variant="link"
          fontSize="xs"
          color={theme.colors.header.color}
          _hover={{ color: theme.colors.header.hover.color }}
          _active={{ color: theme.colors.header.hover.color }}
        >
          ログイン
        </MenuButton>
        <MenuList bg={theme.colors.background}>
          <MenuItem
            _hover={{ bg: "#7289DA", color: "white" }}
            bg={theme.colors.background}
            color={theme.colors.color}
          >
            <SignIn
              provider="discord"
              buttonText={"Discordでログイン"}
              icon={<BsDiscord size="1.5em" />}
            />
          </MenuItem>
          <MenuItem
            _hover={{ bg: "#DB4437", color: "white" }}
            bg={theme.colors.background}
            color={theme.colors.color}
          >
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
      <>
        {session?.user.name === null ? (
          <SignOut />
        ) : (
          <Menu placement="bottom">
            <MenuButton
              fontSize="sm"
              color={theme.colors.header.color}
              _hover={{
                color: theme.colors.header.hover.color,
              }}
              _active={{ color: theme.colors.header.hover.color }}
              className="dropdown-toggle"
            >
              {session.user.name}
            </MenuButton>
            <MenuList bg={theme.colors.background} minW="fit-content">
              {loginMenuItem.map((item, index) => {
                return <LinkMenuItem key={index} title={item.title} href={item.href} />;
              })}

              <MenuDivider />

              <Box as="form" action={submitSignOut}>
                <MenuItem
                  type="submit"
                  fontSize="sm"
                  bg={theme.colors.background}
                  _hover={{
                    bg: "gray.600",
                  }}
                  color={theme.colors.color}
                >
                  ログアウト
                </MenuItem>
              </Box>
            </MenuList>
          </Menu>
        )}

        <CheckName name={session.user.name ?? ""} />
      </>
    );
  }
}
