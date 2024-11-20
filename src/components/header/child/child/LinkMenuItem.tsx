import { ThemeColors } from "@/types";
import { Link, MenuItem, useTheme } from "@chakra-ui/react";

interface LinkMenuItemProps {
  title: string;
  href: string;
}

const LinkMenuItem = ({ title, href }: LinkMenuItemProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Link href={href} _hover={{ textDecoration: "none" }}>
      <MenuItem
        fontSize="sm"
        bg={theme.colors.background.body}
        _hover={{
          bg: "gray.600",
        }}
        color={theme.colors.text.body}
      >
        {title}
      </MenuItem>
    </Link>
  );
};

export default LinkMenuItem;
