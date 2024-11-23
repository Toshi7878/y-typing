import { ThemeColors } from "@/types";

import { Box, Button, Menu, MenuButton, MenuList, useTheme } from "@chakra-ui/react";
import LinkMenuItem from "../child/LinkMenuItem";
import { leftLink, leftMenuItem } from "@/config/headerNav";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { useInvalidateQueryLink } from "@/lib/hooks/fetcher-hook/useInvalidateQueryLink";
import { queryClient } from "@/app/timeline/TimelineProvider";
import { QUERY_KEYS } from "@/config/consts";

function LeftMenus() {
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();
  const invalidateQueryLink = useInvalidateQueryLink();

  return (
    <Box as="nav" display={{ base: "none", md: "block" }}>
      <Menu placement="bottom">
        <MenuButton
          cursor="pointer"
          color={theme.colors.text.header.normal}
          _hover={{
            color: theme.colors.text.header.hover,
          }}
          className="dropdown-toggle"
          fontSize="sm"
          _active={{ color: theme.colors.text.header.hover }}
        >
          Menu
        </MenuButton>
        <MenuList bg={theme.colors.background.body} minW="fit-content">
          {leftMenuItem.map((menuItem, index) => {
            return <LinkMenuItem key={index} title={menuItem.title} href={menuItem.href} />;
          })}
        </MenuList>
      </Menu>
      {leftLink.map((link, index) => {
        return (
          <Link
            as={Button}
            key={index}
            href={link.href}
            cursor="pointer"
            color={theme.colors.text.header.normal}
            _hover={{
              color: theme.colors.text.header.hover,
            }}
            fontSize="sm"
            _active={{ color: theme.colors.text.header.hover }}
            ml={5}
            onClick={
              link.href === "/timeline"
                ? (event) => invalidateQueryLink(event, queryClient, QUERY_KEYS.usersResultList)
                : handleLinkClick
            }
          >
            {link.title}
          </Link>
        );
      })}
    </Box>
  );
}

export default LeftMenus;
