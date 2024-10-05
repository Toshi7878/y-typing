import { NavItem, ThemeColors } from "@/types";

import { Box, Menu, MenuButton, MenuList, useTheme } from "@chakra-ui/react";
import LinkMenuItem from "../child/LinkMenuItem";

interface LeftMenusProps {
  items: NavItem[];
}
function LeftMenus({ items }: LeftMenusProps) {
  const theme: ThemeColors = useTheme();

  return (
    <Box as="nav">
      {items?.map((item, index) => {
        return (
          <Menu placement="bottom" key={index}>
            <MenuButton
              cursor="pointer"
              color={theme.colors.header.color}
              _hover={{
                color: theme.colors.header.hover.color,
              }}
              className="dropdown-toggle"
              fontSize="sm"
              _active={{ color: theme.colors.header.hover.color }}
              ml={5}
            >
              {item.title}
            </MenuButton>
            <MenuList bg={theme.colors.background} minW="fit-content">
              {item.menuItem.map((menuItem, index) => {
                return <LinkMenuItem key={index} title={menuItem.title} href={menuItem.href} />;
              })}
            </MenuList>
          </Menu>
        );
      })}
    </Box>
  );
}

export default LeftMenus;
