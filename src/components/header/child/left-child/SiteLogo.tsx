import { ThemeColors } from "@/types";
import { Text, useTheme } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";

function SiteLogo() {
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();
  return (
    <Link
      href={"/"}
      onClick={handleLinkClick}
      fontSize="2xl"
      position="relative"
      top={"-2.5px"}
      color={theme.colors.text.body}
      _hover={{
        color: theme.colors.text.header.hover,
        bg: `${theme.colors.secondary.main}30`,
      }}
      px={2}
    >
      <Text as="span" fontWeight="bold">
        Y
      </Text>
      <Text as="span" fontWeight="bold">
        Typing
      </Text>
    </Link>
  );
}

export default SiteLogo;
