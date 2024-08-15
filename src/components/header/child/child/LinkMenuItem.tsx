import { ThemeColors } from "@/types";
import { Link, MenuItem, useTheme } from "@chakra-ui/react";

interface LinkMenuItemProps {
  title: string;
  href: string;
}

const LinkMenuItem = ({ title, href }: LinkMenuItemProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <MenuItem
      fontSize="sm"
      bg={theme.colors.background}
      _hover={{
        bg: "gray.600",
      }}
      color={theme.colors.color}
    >
      <Link href={href} _hover={{ textDecoration: "none" }}>
        {title}
      </Link>
    </MenuItem>
  );
};

export default LinkMenuItem;
