"use client";

import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  ResponsiveValue,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ThemeColors } from "@/types";
import LinkMenuItem from "../child/child/LinkMenuItem";
import { leftLink, leftMenuItem } from "@/config/headerNav";
import LogOutMenuItem from "../child/right-child/login/child/LogOutMenuItem";
import { useSession } from "next-auth/react";
import SignInMenuItem from "../child/right-child/login/child/SignInMenuItem";
import { BsDiscord, BsGoogle } from "react-icons/bs";
import NewCreateModal from "../child/right-child/new-map/child/NewCreateModal";

interface HamburgerMenuProps {
  display: ResponsiveValue<string>;
}

const HamburgerMenu = ({ display }: HamburgerMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme: ThemeColors = useTheme();
  const { data: session } = useSession();
  const newCreateModalDisclosure = useDisclosure();

  const menus = leftMenuItem.concat(leftLink);
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={display}
          onClick={onOpen}
          size={"sm"}
          variant={"outline"}
        />
        <MenuList bg={theme.colors.background.body} minW="fit-content">
          {menus.map((menuItem, index) => {
            return <LinkMenuItem key={index} title={menuItem.title} href={menuItem.href} />;
          })}
          {session?.user.id ? (
            <>
              <MenuItem
                onClick={newCreateModalDisclosure.onOpen}
                bg={theme.colors.background.body}
                color={theme.colors.text.body}
                _hover={{
                  bg: theme.colors.background.header,
                }}
              >
                譜面新規作成
              </MenuItem>
              <LogOutMenuItem />
            </>
          ) : (
            <>
              <MenuDivider />

              <SignInMenuItem
                _hover={{ bg: "#7289DA", color: "white" }}
                text={"Discordでログイン"}
                leftIcon={<BsDiscord size="1.5em" />}
              />
              <SignInMenuItem
                _hover={{ bg: "#DB4437", color: "white" }}
                text={"Googleでログイン"}
                leftIcon={<BsGoogle size="1.5em" />}
              />
            </>
          )}
        </MenuList>
      </Menu>

      {newCreateModalDisclosure.isOpen && (
        <NewCreateModal newCreateModalDisclosure={newCreateModalDisclosure} />
      )}
    </>
  );
};

export default HamburgerMenu;
