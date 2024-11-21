import { MenuDivider, useTheme } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ThemeColors } from "@/types";
import LinkMenuItem from "../../child/LinkMenuItem";
import { loginMenuItem } from "@/config/headerNav";
import LogOutMenuItem from "./child/LogOutMenuItem";

export default function UserMenu() {
  const { data: session } = useSession();
  const theme: ThemeColors = useTheme();

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

        <LogOutMenuItem />
      </MenuList>
    </Menu>
  );
}
