import { NavItem, ThemeColors } from "@/types";

import { Box, Button, Menu, MenuButton, MenuList, useTheme } from "@chakra-ui/react";
import LinkMenuItem from "../child/LinkMenuItem";
import { leftLink } from "@/config/headerNav";
import { Link } from "@chakra-ui/next-js";

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

      {leftLink.map((link, index) => {
        return (
          <Link
            as={Button}
            key={index}
            href={link.href}
            cursor="pointer"
            color={theme.colors.header.color}
            _hover={{
              color: theme.colors.header.hover.color,
            }}
            fontSize="sm"
            _active={{ color: theme.colors.header.hover.color }}
            ml={5}
          >
            {link.title}
          </Link>
        );
      })}
    </Box>
  );
}

export default LeftMenus;
