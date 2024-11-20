import { Box, MenuItem, useTheme } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, Button } from "@chakra-ui/react";
import { BsDiscord } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { ThemeColors } from "@/types";
import { handleSignIn } from "./authAction";

export default function SignInMenu() {
  const theme: ThemeColors = useTheme();

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="link"
        fontSize="xs"
        color={theme.colors.text.header.normal}
        _hover={{ color: theme.colors.text.header.hover }}
        _active={{ color: theme.colors.text.header.hover }}
        className="dropdown-toggle"
      >
        ログイン
      </MenuButton>
      <MenuList bg={theme.colors.background.body}>
        <Box as="form" action={() => handleSignIn("discord")}>
          <MenuItem
            _hover={{ bg: "#7289DA", color: "white" }}
            bg={theme.colors.background.body}
            color={theme.colors.text.body}
            type="submit"
          >
            <Button leftIcon={<BsDiscord size="1.5em" />} variant="">
              Discordでログイン
            </Button>
          </MenuItem>
        </Box>
        <Box as="form" action={() => handleSignIn("google")}>
          <MenuItem
            _hover={{ bg: "#DB4437", color: "white" }}
            bg={theme.colors.background.body}
            color={theme.colors.text.body}
            type="submit"
          >
            <Button leftIcon={<BsGoogle size="1.5em" />} variant="">
              Googleでログイン
            </Button>
          </MenuItem>
        </Box>
      </MenuList>
    </Menu>
  );
}
