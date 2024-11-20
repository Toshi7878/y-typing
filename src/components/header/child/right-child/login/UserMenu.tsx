import { Box, MenuDivider, MenuItem, useTheme } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ThemeColors } from "@/types";
import { handleSignOut } from "./authAction";
import LinkMenuItem from "../../child/LinkMenuItem";
import { loginMenuItem } from "@/config/headerNav";

export default function UserMenu() {
  const { data: session } = useSession();
  const theme: ThemeColors = useTheme();

  const submitSignOut = async () => {
    await handleSignOut();
    window.location.reload();
  };

  return (
    <Menu placement="bottom">
      <MenuButton
        fontSize="sm"
        color={theme.colors.text.header.normal}
        _hover={{
          color: theme.colors.text.header.hover,
        }}
        _active={{ color: theme.colors.text.header.hover }}
        className="dropdown-toggle"
      >
        {session!.user!.name}
      </MenuButton>
      <MenuList bg={theme.colors.background.body} minW="fit-content">
        {loginMenuItem.map((item, index) => {
          return <LinkMenuItem key={index} title={item.title} href={item.href} />;
        })}

        <MenuDivider />

        <Box as="form" action={submitSignOut}>
          <MenuItem
            type="submit"
            fontSize="sm"
            bg={theme.colors.background.body}
            _hover={{
              bg: "gray.600",
            }}
            color={theme.colors.text.body}
          >
            ログアウト
          </MenuItem>
        </Box>
      </MenuList>
    </Menu>
  );
}
